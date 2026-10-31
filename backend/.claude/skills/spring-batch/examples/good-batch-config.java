// GOOD: Spring Batch 6 / Boot 4.1. No @EnableBatchProcessing, no incrementer (duplicate runs are
// prevented by deterministic identifying job params such as runDate). Builders take JobRepository, the chunk
// step sets .transactionManager(tm), reader is @StepScope with a deterministic sort.

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
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class OrderExportJobConfig {

    @Bean
    public Job orderExportJob(JobRepository jobRepository, Step exportStep) {
        return new JobBuilder("orderExportJob", jobRepository)
            .listener(new ExportCompletionListener())     // side effects AFTER the job, never in the writer
            .start(exportStep)
            .build();
    }

    @Bean
    public Step exportStep(JobRepository jobRepository,
                           PlatformTransactionManager txManager,   // injected, Boot already created it
                           ItemReader<Order> orderReader,
                           ItemProcessor<Order, OrderRow> orderProcessor,
                           ItemWriter<OrderRow> orderWriter) {
        return new StepBuilder("exportStep", jobRepository)
            .<Order, OrderRow>chunk(500)                   // commit interval == transaction boundary
            .transactionManager(txManager)                 // required: default is a resourceless, non-transactional manager
            .reader(orderReader)
            .processor(orderProcessor)
            .writer(orderWriter)
            .faultTolerant()                               // required before skip/retry
            .skip(FlatFileParseException.class)
            .skipLimit(50)                                 // tolerate up to 50 bad rows, then fail the step
            .build();
    }

    @Bean
    @StepScope                                             // late-binds jobParameters at execution time
    public JpaPagingItemReader<Order> orderReader(
            EntityManagerFactory emf,
            @Value("#{jobParameters['status']}") String status) {
        return new JpaPagingItemReaderBuilder<Order>()
            .name("orderReader")
            .entityManagerFactory(emf)
            .queryString("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.id") // unique sort key
            .parameterValues(Map.of("status", OrderStatus.valueOf(status)))
            .pageSize(500)                                 // matches chunk size
            .build();
    }

    @Bean
    public ItemProcessor<Order, OrderRow> orderProcessor() {
        return order -> order.getTotal().isZero() ? null   // null = filter; documented intent
                                                  : OrderRow.from(order);
    }

    @Bean
    public JdbcBatchItemWriter<OrderRow> orderWriter(DataSource dataSource) {
        return new JdbcBatchItemWriterBuilder<OrderRow>()
            .dataSource(dataSource)
            .sql("INSERT INTO order_export (id, total) VALUES (:id, :total)")
            .beanMapped()
            .build();
    }
}
