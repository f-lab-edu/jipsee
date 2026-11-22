package kr.jipsee.batch.deal;

import static kr.jipsee.batch.deal.DealJobConfig.PARAM_COLLECT_DATE;

import java.time.Clock;
import java.time.LocalDate;
import kr.jipsee.batch.common.JobParametersProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;

/** 일일 수집 Job의 파라미터 계산. collectDate는 실행일(KST) */
@RequiredArgsConstructor
public class DailyCollectJobParametersProvider implements JobParametersProvider {
    private final String jobName;
    private final Clock clock;

    @Override
    public String jobName() {
        return jobName;
    }

    @Override
    public JobParameters create() {
        return new JobParametersBuilder()
                .addString(PARAM_COLLECT_DATE, LocalDate.now(clock).toString())
                .toJobParameters();
    }
}
