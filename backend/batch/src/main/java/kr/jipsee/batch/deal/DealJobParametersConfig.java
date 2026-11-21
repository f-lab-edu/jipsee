package kr.jipsee.batch.deal;

import static kr.jipsee.batch.deal.DealJobConfig.DAILY_RENT_JOB;
import static kr.jipsee.batch.deal.DealJobConfig.DAILY_SALE_JOB;
import static kr.jipsee.batch.deal.DealJobConfig.INITIAL_RENT_JOB;
import static kr.jipsee.batch.deal.DealJobConfig.INITIAL_SALE_JOB;

import java.time.Clock;
import kr.jipsee.batch.common.JobParametersProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** 실거래 수집 Job 4개의 파라미터 제공자 빈 구성 */
@Configuration
public class DealJobParametersConfig {

    /** 전월세 일일 수집 Job의 파라미터 제공자 */
    @Bean
    JobParametersProvider dailyRentJobParametersProvider(Clock clock) {
        return new DailyCollectJobParametersProvider(DAILY_RENT_JOB, clock);
    }

    /** 매매 일일 수집 Job의 파라미터 제공자 */
    @Bean
    JobParametersProvider dailySaleJobParametersProvider(Clock clock) {
        return new DailyCollectJobParametersProvider(DAILY_SALE_JOB, clock);
    }

    /** 전월세 초기 적재 Job의 파라미터 제공자 */
    @Bean
    JobParametersProvider initialRentJobParametersProvider(DealBatchProperties properties) {
        return new InitialLoadJobParametersProvider(INITIAL_RENT_JOB, properties);
    }

    /** 매매 초기 적재 Job의 파라미터 제공자 */
    @Bean
    JobParametersProvider initialSaleJobParametersProvider(DealBatchProperties properties) {
        return new InitialLoadJobParametersProvider(INITIAL_SALE_JOB, properties);
    }
}
