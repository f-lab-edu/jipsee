---
name: spring-batch
description: >
  Use when building batch jobs, ETL pipelines, scheduled imports/exports, or any chunk-oriented
  bulk processing with Spring Batch. Covers the Spring Batch 6 / Boot 4.1 builder API, duplicate-run
  prevention with deterministic job parameters, reader/writer thread-safety, fault tolerance, and
  chunk transaction boundaries.
---

# Spring Batch

Spring Boot 4.1 manages **Spring Batch 6.0**. The API changed significantly from 4.x and 5.x, so most
online examples are wrong. The rules that break the most agent-generated code:

1. **Do NOT add `@EnableBatchProcessing`.** Boot auto-configures the `JobRepository`, `JobOperator`,
   and transaction manager. Adding `@EnableBatchProcessing` **disables** that auto-configuration and
   you lose all the wired beans.
2. **`JobBuilderFactory` and `StepBuilderFactory` are gone.** Build jobs and steps with
   `new JobBuilder(name, jobRepository)` / `new StepBuilder(name, jobRepository)`, injecting the
   `JobRepository` and `PlatformTransactionManager` Boot already created.
3. **Chunk steps need `.transactionManager(tm)`.** Without it the chunk step silently defaults to a
   `ResourcelessTransactionManager` and writes are not transactional.

Dependencies: `org.springframework.boot:spring-boot-starter-batch-jdbc` for a DB-backed job
repository (plain `spring-boot-starter-batch` is in-memory and cannot guard against duplicate runs
or restart), and `spring-boot-starter-batch-jdbc-test` for tests.

Packages: `org.springframework.batch.core.job.Job`, `core.job.builder.JobBuilder`,
`core.step.builder.StepBuilder`, `core.job.parameters.JobParameters` / `JobParametersBuilder`,
`core.repository.JobRepository`, `core.launch.JobOperator`. Item types live in
`org.springframework.batch.infrastructure.item.*` (`ItemReader`, `ItemWriter`, `ItemProcessor`,
`Chunk`), with readers/writers in `infrastructure.item.database.*` and their builders in
`infrastructure.item.database.builder.*`.

Single Spring instance only: no ShedLock, `@Scheduled` is enough.

## Job & Step (Spring Batch 6 API)

```java
@Configuration
public class OrderExportJobConfig {

    @Bean
    public Job orderExportJob(JobRepository jobRepository, Step exportStep) {
        return new JobBuilder("orderExportJob", jobRepository)
            .start(exportStep)
            .build();
    }

    @Bean
    public Step exportStep(JobRepository jobRepository,
                           PlatformTransactionManager txManager, // Boot's, injected, do NOT new one up
                           ItemReader<Order> reader,
                           ItemProcessor<Order, OrderRow> processor,
                           ItemWriter<OrderRow> writer) {
        return new StepBuilder("exportStep", jobRepository)
            .<Order, OrderRow>chunk(500)       // chunk size is the commit interval and a TX boundary
            .transactionManager(txManager)     // REQUIRED: the default is a resourceless (non-transactional) manager
            .reader(reader)
            .processor(processor)
            .writer(writer)
            .faultTolerant()                   // required before skip/retry
            .skip(FlatFileParseException.class)
            .skipLimit(50)                     // default skipLimit is 10
            .build();
    }
}
```

`chunk(500)` means: read 500 items, process each, hand the chunk of 500 to the writer, **commit one
transaction**, repeat. The chunk is the unit of restart and the unit of rollback. The old
`chunk(500, txManager)` form is deprecated for removal in 6.0.

Exceptions thrown by listeners are fatal: they are never skipped or retried.

## Idempotency & Restartability: the #1 operational gotcha

A `JobInstance` is identified by its **identifying** `JobParameters`. Prevent duplicate runs with a
**deterministic identifying parameter** that comes from the business key, for example `runDate`.
Do NOT add a `RunIdIncrementer` and do NOT add `run.id = System.currentTimeMillis()`: a unique value
per launch makes every launch a new instance and defeats the duplicate guard.

```java
JobParameters params = new JobParametersBuilder()
    .addString("runDate", LocalDate.now().toString()) // identifying and deterministic: one instance per day
    .toJobParameters();
```

With a DB job repository and no incrementer, launching the same identifying parameters again is
rejected on purpose:

- the instance is already `COMPLETED`: `JobInstanceAlreadyCompleteException`
- an execution of the instance is still running: `JobExecutionAlreadyRunningException`

Treat both as expected duplicates in the launcher, not as errors. If the job has an incrementer,
`jobOperator.start(job, params)` ignores the given parameters and starts the next instance, which is
another reason not to use one.

Mark a parameter **non-identifying** with the `false` flag when it is metadata that must not change
the instance identity (for example a request id you log but do not key on):

```java
.addString("requestId", requestId, false) // non-identifying, excluded from the instance key
```

A **failed** instance is resumed, not recreated: restart its last failed execution and it skips
completed steps and restarts the failed step from the last committed chunk. That is the point of the
metadata tables. Never add a unique parameter per launch if you want resume-on-failure.

## ItemReader: sort key and thread-safety

```java
@Bean
@StepScope // required: late-binds jobParameters at step execution, not context startup
public JpaPagingItemReader<Order> orderReader(
        EntityManagerFactory emf,
        @Value("#{jobParameters['status']}") String status) {
    return new JpaPagingItemReaderBuilder<Order>()
        .name("orderReader")
        .entityManagerFactory(emf)
        .queryString("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.id") // ORDER BY is MANDATORY
        .parameterValues(Map.of("status", OrderStatus.valueOf(status)))
        .pageSize(500) // keep pageSize == chunk size
        .build();
}
```

- **Paging readers require a deterministic `ORDER BY`** on a unique column. Without it the DB returns
  rows in arbitrary order across pages, so rows get **skipped or processed twice**. This is silent
  data corruption, not an error.
- **`JdbcCursorItemReader` is NOT thread-safe.** `JdbcPagingItemReader` / `JpaPagingItemReader` are
  safe for multi-threaded steps. For a non-thread-safe reader in a multi-threaded step, wrap it in
  `SynchronizedItemStreamReader`.
- **Don't mutate the column you page on inside the same job.** If the writer flips `status` from
  `PENDING` to `DONE` while the reader pages `WHERE status = 'PENDING' ORDER BY id`, the result set
  shifts under you and pages are missed. Read into a stable snapshot, page by immutable `id`, or use
  a cursor reader.

## ItemProcessor: returning null filters

```java
@Component
public class OrderProcessor implements ItemProcessor<Order, OrderRow> {
    @Override
    public OrderRow process(Order order) {
        if (order.getTotal().isZero()) {
            return null; // null = FILTER this item; it is NOT written and NOT an error
        }
        return OrderRow.from(order);
    }
}
```

Returning `null` silently drops the item from the chunk. That is a feature (filtering) but a footgun
if you returned `null` by accident expecting it to pass through.

## ItemWriter: receives a Chunk

The writer receives a `Chunk<? extends T>`, **not** `List<? extends T>`:

```java
@Override
public void write(Chunk<? extends OrderRow> chunk) {
    repository.saveAll(chunk.getItems());
}
```

For SQL writes, prefer the batched JDBC writer over per-row saves. It uses one `addBatch()`:

```java
@Bean
public JdbcBatchItemWriter<OrderRow> orderWriter(DataSource dataSource) {
    return new JdbcBatchItemWriterBuilder<OrderRow>()
        .dataSource(dataSource)
        .sql("INSERT INTO order_export (id, total) VALUES (:id, :total)")
        .beanMapped()
        .build();
}
```

The writer runs **inside the chunk transaction**. Never fire emails, publish to Kafka, or call
webhooks from a writer: if the chunk rolls back you have already sent it. Bind side effects to the
job completion instead (see [[transactional-patterns]] and the listener below).

## Launching jobs

Boot runs every `Job` bean on startup by default. For scheduled or on-demand jobs, **turn that off**
and launch explicitly:

```yaml
spring:
  batch:
    job:
      enabled: false            # don't run jobs on app startup; we trigger them ourselves
    jdbc:
      initialize-schema: never  # BATCH_* schema is applied outside the repo, like every other table
```

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderExportScheduler {

    private final JobOperator jobOperator;
    private final Job orderExportJob;

    @Scheduled(cron = "0 0 2 * * *")
    public void runNightly() {
        JobParameters params = new JobParametersBuilder()
            .addString("status", "COMPLETED")
            .addString("runDate", LocalDate.now().toString()) // identifying and deterministic
            .toJobParameters();
        try {
            jobOperator.start(orderExportJob, params);
        } catch (JobInstanceAlreadyCompleteException e) {
            log.info("orderExportJob already completed for {}", params.getString("runDate")); // expected duplicate
        } catch (JobExecutionAlreadyRunningException e) {
            log.warn("orderExportJob is still running for {}", params.getString("runDate"));
        } catch (JobExecutionException e) {
            log.error("Failed to launch orderExportJob", e);
        }
    }
}
```

Use `JobOperator`, not `JobLauncher`: `JobLauncher` is deprecated for removal. Boot's `JobOperator`
runs **synchronously** by default, so `start(...)` blocks the `@Scheduled` thread until the whole job
finishes. `start` throws `JobInstanceAlreadyCompleteException`, `JobExecutionAlreadyRunningException`,
`InvalidJobParametersException`, and `JobRestartException`.

## Metadata schema in production

Spring Batch needs its `BATCH_JOB_INSTANCE`, `BATCH_JOB_EXECUTION`, `BATCH_STEP_EXECUTION`, ... tables.
This repo holds no schema SQL and no migrations for any table, including `BATCH_*`. Their schema SQL
lives outside the repo (`$SCHEMA_DIR`) and is applied there. In every profile set
`spring.batch.jdbc.initialize-schema: never` and keep `ddl-auto: validate`. Never add `schema-*.sql`
files or any `BATCH_*` DDL to this repo.

## Listeners: work that must run after the job, not per chunk

```java
@Bean
public Job orderExportJob(JobRepository jobRepository, Step exportStep) {
    return new JobBuilder("orderExportJob", jobRepository)
        .listener(new JobExecutionListener() {
            @Override public void afterJob(JobExecution exec) {
                if (exec.getStatus() == BatchStatus.COMPLETED) {
                    notifier.notifyExportReady(exec.getJobParameters()); // safe: all chunks committed
                }
            }
        })
        .start(exportStep)
        .build();
}
```

## Don't reach for Batch when you don't need it

Spring Batch earns its complexity (metadata tables, restart, chunking) on **large, restartable,
auditable bulk jobs**. For a quick one-off async task, `@Async` or a `@Scheduled` loop is lighter.
For durable background jobs with retry, a job queue is a better fit. Match the tool to the scale.

## Gotchas
- Agent adds `@EnableBatchProcessing`: it **disables** Boot auto-config; remove it, just inject `JobRepository`
- Agent uses `JobBuilderFactory` / `StepBuilderFactory`: removed; use `new JobBuilder(name, repo)` / `new StepBuilder(name, repo)`
- Agent writes `.chunk(500, txManager)`: deprecated for removal in 6.0; use `.<I, O>chunk(500).transactionManager(txManager)`
- Agent writes `.chunk(500)` without `.transactionManager(tm)`: the step defaults to `ResourcelessTransactionManager`, so writes are NOT transactional
- Agent writes `write(List<? extends T> items)`: the signature is `write(Chunk<? extends T> chunk)`
- Agent uses `JobLauncher`: deprecated for removal; use `JobOperator` (`jobOperator.start(job, params)`)
- Agent adds `RunIdIncrementer` or `run.id = currentTimeMillis()` to avoid `JobInstanceAlreadyCompleteException`: repeating the same business key (e.g. `runDate`) is rejected on purpose; catch the exception as an expected duplicate. With an incrementer, `start(job, params)` also ignores your params
- Agent adds a unique param every run on a job that should resume-on-failure: kills restartability and the duplicate guard
- Agent writes a paging reader query with no `ORDER BY` (or a non-unique one): pages skip/duplicate rows silently; order by a unique column
- Agent uses `JdbcCursorItemReader` in a multi-threaded step: not thread-safe; use a paging reader or `SynchronizedItemStreamReader`
- Agent pages on a column the writer mutates in the same job: result set shifts; page on an immutable id
- Agent returns `null` from a processor expecting pass-through: `null` filters (drops) the item
- Agent sends email / publishes events from the `ItemWriter`: runs inside the chunk TX; do it in an `afterJob` listener
- Agent forgets `@StepScope` on a reader that reads `jobParameters`: `@Value("#{jobParameters[...]}")` only binds in step scope
- Agent calls `.skip(...)` / `.retry(...)` without `.faultTolerant()`: it is required first; `skipLimit` defaults to 10, and listener exceptions are fatal (never skipped or retried)
- Agent leaves jobs running on startup in a web app: set `spring.batch.job.enabled: false` and launch explicitly
- Agent lets Batch DDL the DB or adds `schema-*.sql` / Flyway for `BATCH_*`: use `initialize-schema: never` in all profiles; the schema is applied outside the repo
- Agent adds ShedLock or a distributed lock: single Spring instance, `@Scheduled` is enough
- Agent uses plain `spring-boot-starter-batch` and expects restart or duplicate guard: it is in-memory; use `spring-boot-starter-batch-jdbc`
