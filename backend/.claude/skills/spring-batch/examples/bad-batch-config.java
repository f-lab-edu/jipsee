// BAD: every line here is a Spring Batch 4.x/5.x habit that breaks on Boot 4 / Batch 6,
// or a silent data-correctness bug.

@Configuration
@EnableBatchProcessing  // BAD: this DISABLES Boot auto-config, so JobRepository/JobOperator vanish
public class OrderExportJobConfig {

    private final JobBuilderFactory jobBuilderFactory;   // BAD: removed, won't compile
    private final StepBuilderFactory stepBuilderFactory; // BAD: removed, won't compile

    public OrderExportJobConfig(JobBuilderFactory jobBuilderFactory, StepBuilderFactory stepBuilderFactory) {
        this.jobBuilderFactory = jobBuilderFactory;
        this.stepBuilderFactory = stepBuilderFactory;
    }

    @Bean
    public Job orderExportJob(Step exportStep) {
        return jobBuilderFactory.get("orderExportJob")   // BAD: factory API gone
            .start(exportStep)
            .build();
    }

    @Bean
    public Step exportStep(ItemReader<Order> reader,
                           ItemWriter<OrderRow> writer) {
        return stepBuilderFactory.get("exportStep")
            .<Order, OrderRow>chunk(500)                 // BAD: chunk(500, txManager) is deprecated for removal in 6.0;
                                                         //      the new form needs .transactionManager(tm), else writes are not transactional
            .reader(reader)
            .writer(writer)
            .build();
    }

    @Bean
    public JdbcCursorItemReader<Order> reader(DataSource ds) { // BAD: cursor reader is NOT thread-safe
        JdbcCursorItemReader<Order> r = new JdbcCursorItemReader<>();
        r.setDataSource(ds);
        r.setSql("SELECT id, total FROM orders WHERE status = 'PENDING'"); // BAD: no ORDER BY, pages drift
        r.setRowMapper(new OrderRowMapper());
        return r;
        // BAD: not @StepScope, so it can't read jobParameters
    }

    @Bean
    public ItemWriter<OrderRow> writer(EmailService email, OrderExportRepository repo) {
        return items -> {                                // BAD: the writer receives Chunk<>, not List<>
            repo.saveAll(items);
            email.send("export-done@co", "batch finished"); // BAD: inside chunk TX, fires even if the chunk rolls back
        };
    }
}
