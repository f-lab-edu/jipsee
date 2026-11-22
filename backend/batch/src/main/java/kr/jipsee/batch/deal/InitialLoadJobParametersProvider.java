package kr.jipsee.batch.deal;

import static kr.jipsee.batch.deal.DealJobConfig.PARAM_END_MONTH;

import kr.jipsee.batch.common.JobParametersProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;

/** 초기 적재 Job의 파라미터 계산. endMonth는 설정값 */
@RequiredArgsConstructor
public class InitialLoadJobParametersProvider implements JobParametersProvider {
    private final String jobName;
    private final DealBatchProperties properties;

    @Override
    public String jobName() {
        return jobName;
    }

    @Override
    public JobParameters create() {
        return new JobParametersBuilder()
                .addString(PARAM_END_MONTH, properties.initialLoadEndMonth().toString())
                .toJobParameters();
    }
}
