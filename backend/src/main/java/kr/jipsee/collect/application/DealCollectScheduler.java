package kr.jipsee.collect.application;

import static kr.jipsee.collect.config.CollectJobConfig.PARAM_COLLECT_DATE;
import static kr.jipsee.collect.config.CollectJobConfig.PARAM_END_MONTH;

import java.time.Clock;
import java.time.LocalDate;
import kr.jipsee.collect.config.CollectProperties;
import kr.jipsee.global.common.TimeZones;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecutionException;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.launch.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.launch.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/** 매일 새벽 4시에 실거래 수집 Job 실행 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DealCollectScheduler {
    private final JobOperator jobOperator;
    private final Job dailyRentCollectJob;
    private final Job dailySaleCollectJob;
    private final Job initialRentLoadJob;
    private final Job initialSaleLoadJob;
    private final CollectProperties properties;
    private final Clock clock;

    /** 일일 Job 2개, 초기 적재 Job 2개 순서로 시작. 하나의 Job에서 예외가 발생해도 다음 Job의 시작을 막지 않음 */
    @Scheduled(cron = "0 0 4 * * *", zone = TimeZones.SEOUL_ID)
    public void collect() {
        JobParameters dailyParams = new JobParametersBuilder()
                .addString(PARAM_COLLECT_DATE, LocalDate.now(clock).toString())
                .toJobParameters();
        JobParameters initialParams = new JobParametersBuilder()
                .addString(PARAM_END_MONTH, properties.initialLoadEndMonth().toString())
                .toJobParameters();

        start(dailyRentCollectJob, dailyParams);
        start(dailySaleCollectJob, dailyParams);
        start(initialRentLoadJob, initialParams);
        start(initialSaleLoadJob, initialParams);
    }

    /** Job 시작. 예외 발생 시 로그만 남기고 전파하지 않음 */
    private void start(Job job, JobParameters params) {
        try {
            jobOperator.start(job, params);
        } catch (JobInstanceAlreadyCompleteException e) {
            log.info("이미 완료된 Job이라 시작하지 않음: {}, 파라미터 {}", job.getName(), params);
        } catch (JobExecutionAlreadyRunningException e) {
            log.warn("이미 실행 중인 Job이라 시작하지 않음: {}, 파라미터 {}", job.getName(), params);
        } catch (JobExecutionException e) {
            log.error("Job 시작에 실패함: {}, 파라미터 {}", job.getName(), params, e);
        }
    }
}
