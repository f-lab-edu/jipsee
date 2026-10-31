// Copy-paste starting point for a chunk-oriented Spring Batch 6 job (Spring Boot 4.1).
// Replace Order / OrderRow / the reader query and writer SQL with your domain.
// Do NOT add @EnableBatchProcessing: Boot auto-configures JobRepository + transaction manager.
// Do NOT add an incrementer: duplicate runs are prevented by deterministic identifying job params (e.g. runDate).

import java.util.Map;
import javax.sql.DataSource;

import jakarta.persistence.EntityManagerFactory;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.Step;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.infrastructure.item.ItemProcessor;
import org.springframework.batch.infrastructure.item.ItemReader;
import org.springframework.batch.infrastructure.item.ItemWriter;
import org.springframework.batch.infrastructure.item.database.JdbcBatchItemWriter;
import org.springframework.batch.infrastructure.item.database.JpaPagingItemReader;
import org.springframework.batch.infrastructure.item.database.builder.JdbcBatchItemWriterBuilder;
import org.springframework.batch.infrastructure.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.batch.infrastructure.item.file.FlatFileParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.TransientDataAccessException;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class ChunkJobConfig {

    private static final int CHUNK_SIZE = 500;

    @Bean
    public Job exampleJob(JobRepository jobRepository, Step exampleStep) {
        return new JobBuilder("exampleJob", jobRepository)
            .start(exampleStep)
            .build();
    }

    @Bean
    public Step exampleStep(JobRepository jobRepository,
                            PlatformTransactionManager txManager,
                            ItemReader<Order> reader,
                            ItemProcessor<Order, OrderRow> processor,
                            ItemWriter<OrderRow> writer) {
        return new StepBuilder("exampleStep", jobRepository)
            .<Order, OrderRow>chunk(CHUNK_SIZE)
            .transactionManager(txManager) // required: without it writes run on a resourceless, non-transactional manager
            .reader(reader)
            .processor(processor)
            .writer(writer)
            .faultTolerant()
            .retry(TransientDataAccessException.class).retryLimit(3) // retry transient failures
            .skip(FlatFileParseException.class).skipLimit(50)        // tolerate bad input rows
            .build();
    }

    @Bean
    @StepScope
    public JpaPagingItemReader<Order> reader(
            EntityManagerFactory emf,
            @Value("#{jobParameters['status']}") String status) {
        return new JpaPagingItemReaderBuilder<Order>()
            .name("exampleReader")
            .entityManagerFactory(emf)
            .queryString("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.id") // unique sort key
            .parameterValues(Map.of("status", OrderStatus.valueOf(status)))
            .pageSize(CHUNK_SIZE)
            .build();
    }

    @Bean
    public ItemProcessor<Order, OrderRow> processor() {
        return OrderRow::from; // return null from a processor to FILTER an item out of the chunk
    }

    @Bean
    public JdbcBatchItemWriter<OrderRow> writer(DataSource dataSource) {
        return new JdbcBatchItemWriterBuilder<OrderRow>()
            .dataSource(dataSource)
            .sql("INSERT INTO order_export (id, total) VALUES (:id, :total)")
            .beanMapped()
            .build();
    }
}
