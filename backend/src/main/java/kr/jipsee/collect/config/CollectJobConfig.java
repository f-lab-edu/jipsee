package kr.jipsee.collect.config;

import java.time.Clock;
import java.time.LocalDate;
import java.time.YearMonth;
import kr.jipsee.collect.application.DataSourceLoadTasklet;
import kr.jipsee.collect.application.DealCollectProcessor;
import kr.jipsee.collect.application.DealKeyReader;
import kr.jipsee.collect.application.DealKeys;
import kr.jipsee.collect.application.DealReplaceWriter;
import kr.jipsee.collect.application.SigunguCodes;
import kr.jipsee.collect.client.RtmsApiClient;
import kr.jipsee.collect.client.RtmsRhRentClient;
import kr.jipsee.collect.client.RtmsRhTradeClient;
import kr.jipsee.collect.dao.DataSourceDao;
import kr.jipsee.collect.dto.DealKey;
import kr.jipsee.collect.dto.DealReplaceItem;
import kr.jipsee.deal.application.DealReplacer;
import kr.jipsee.deal.application.RentDealService;
import kr.jipsee.deal.application.SaleDealService;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.Step;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

/** 실거래 수집 Job 4개와 Step, Reader 빈 구성 */
@Configuration
public class CollectJobConfig {
    static final String DAILY_RENT_JOB = "dailyRentCollectJob";
    static final String DAILY_SALE_JOB = "dailySaleCollectJob";
    static final String INITIAL_RENT_JOB = "initialRentLoadJob";
    static final String INITIAL_SALE_JOB = "initialSaleLoadJob";
    public static final String PARAM_COLLECT_DATE = "collectDate";
    public static final String PARAM_END_MONTH = "endMonth";

    private static final YearMonth RENT_FIRST_MONTH = YearMonth.of(2011, 1);
    private static final YearMonth SALE_FIRST_MONTH = YearMonth.of(2006, 1);
    private static final String RENT_SOURCE = "RENT_DEAL";
    private static final String SALE_SOURCE = "SALE_DEAL";

    /** 전월세 일일 수집 Job. 식별 파라미터는 collectDate */
    @Bean
    Job dailyRentCollectJob(JobRepository jobRepository, Step dailyRentStep, Step rentLoadedAtStep) {
        return new JobBuilder(DAILY_RENT_JOB, jobRepository)
                .start(dailyRentStep)
                .next(rentLoadedAtStep)
                .build();
    }

    /** 매매 일일 수집 Job. 식별 파라미터는 collectDate */
    @Bean
    Job dailySaleCollectJob(JobRepository jobRepository, Step dailySaleStep, Step saleLoadedAtStep) {
        return new JobBuilder(DAILY_SALE_JOB, jobRepository)
                .start(dailySaleStep)
                .next(saleLoadedAtStep)
                .build();
    }

    /** 전월세 초기 적재 Job. 식별 파라미터는 endMonth */
    @Bean
    Job initialRentLoadJob(JobRepository jobRepository, Step initialRentStep, Step rentLoadedAtStep) {
        return new JobBuilder(INITIAL_RENT_JOB, jobRepository)
                .start(initialRentStep)
                .next(rentLoadedAtStep)
                .build();
    }

    /** 매매 초기 적재 Job. 식별 파라미터는 endMonth */
    @Bean
    Job initialSaleLoadJob(JobRepository jobRepository, Step initialSaleStep, Step saleLoadedAtStep) {
        return new JobBuilder(INITIAL_SALE_JOB, jobRepository)
                .start(initialSaleStep)
                .next(saleLoadedAtStep)
                .build();
    }

    /** 전월세 일일 수집 Step */
    @Bean
    Step dailyRentStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            DealKeyReader dailyKeyReader,
            RtmsRhRentClient rtmsRhRentClient,
            RentDealService rentDealService) {
        return collectStep(
                "dailyRentStep", jobRepository, transactionManager, dailyKeyReader, rtmsRhRentClient, rentDealService);
    }

    /** 매매 일일 수집 Step */
    @Bean
    Step dailySaleStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            DealKeyReader dailyKeyReader,
            RtmsRhTradeClient rtmsRhTradeClient,
            SaleDealService saleDealService) {
        return collectStep(
                "dailySaleStep", jobRepository, transactionManager, dailyKeyReader, rtmsRhTradeClient, saleDealService);
    }

    /** 전월세 초기 적재 Step */
    @Bean
    Step initialRentStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            DealKeyReader initialRentKeyReader,
            RtmsRhRentClient rtmsRhRentClient,
            RentDealService rentDealService) {
        return collectStep(
                "initialRentStep",
                jobRepository,
                transactionManager,
                initialRentKeyReader,
                rtmsRhRentClient,
                rentDealService);
    }

    /** 매매 초기 적재 Step */
    @Bean
    Step initialSaleStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            DealKeyReader initialSaleKeyReader,
            RtmsRhTradeClient rtmsRhTradeClient,
            SaleDealService saleDealService) {
        return collectStep(
                "initialSaleStep",
                jobRepository,
                transactionManager,
                initialSaleKeyReader,
                rtmsRhTradeClient,
                saleDealService);
    }

    /** collectDate가 속한 달부터 최근 6개월의 키를 읽는 Reader. 두 일일 Step이 함께 사용 */
    @Bean
    @StepScope
    DealKeyReader dailyKeyReader(
            SigunguCodes sigunguCodes, @Value("#{jobParameters['" + PARAM_COLLECT_DATE + "']}") String collectDate) {
        return new DealKeyReader(DealKeys.recent(LocalDate.parse(collectDate), sigunguCodes.codes()));
    }

    /** 2011-01부터 endMonth까지의 키를 읽는 전월세 초기 적재 Reader */
    @Bean
    @StepScope
    DealKeyReader initialRentKeyReader(
            SigunguCodes sigunguCodes, @Value("#{jobParameters['" + PARAM_END_MONTH + "']}") String endMonth) {
        return new DealKeyReader(DealKeys.of(RENT_FIRST_MONTH, YearMonth.parse(endMonth), sigunguCodes.codes()));
    }

    /** 2006-01부터 endMonth까지의 키를 읽는 매매 초기 적재 Reader */
    @Bean
    @StepScope
    DealKeyReader initialSaleKeyReader(
            SigunguCodes sigunguCodes, @Value("#{jobParameters['" + PARAM_END_MONTH + "']}") String endMonth) {
        return new DealKeyReader(DealKeys.of(SALE_FIRST_MONTH, YearMonth.parse(endMonth), sigunguCodes.codes()));
    }

    /** RENT_DEAL의 마지막 수집 시각을 갱신하는 Step. 수집 Step 다음에 실행 */
    @Bean
    Step rentLoadedAtStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            DataSourceDao dataSourceDao,
            Clock clock) {
        return loadedAtStep("rentLoadedAtStep", jobRepository, transactionManager, dataSourceDao, clock, RENT_SOURCE);
    }

    /** SALE_DEAL의 마지막 수집 시각을 갱신하는 Step. 수집 Step 다음에 실행 */
    @Bean
    Step saleLoadedAtStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            DataSourceDao dataSourceDao,
            Clock clock) {
        return loadedAtStep("saleLoadedAtStep", jobRepository, transactionManager, dataSourceDao, clock, SALE_SOURCE);
    }

    /** 키 하나를 chunk 하나, 트랜잭션 하나로 처리하는 수집 Step 생성 */
    private <T> Step collectStep(
            String name,
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            DealKeyReader reader,
            RtmsApiClient<T> client,
            DealReplacer<T> replacer) {
        return new StepBuilder(name, jobRepository)
                .<DealKey, DealReplaceItem<T>>chunk(1)
                .transactionManager(transactionManager)
                .reader(reader)
                .processor(new DealCollectProcessor<>(client, replacer))
                .writer(new DealReplaceWriter<>(replacer))
                .build();
    }

    /** 출처의 마지막 수집 시각을 갱신하는 Tasklet Step 생성 */
    private Step loadedAtStep(
            String name,
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            DataSourceDao dataSourceDao,
            Clock clock,
            String source) {
        return new StepBuilder(name, jobRepository)
                .tasklet(new DataSourceLoadTasklet(dataSourceDao, clock, source), transactionManager)
                .build();
    }
}
