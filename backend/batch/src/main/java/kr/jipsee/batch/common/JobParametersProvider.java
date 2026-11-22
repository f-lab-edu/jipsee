package kr.jipsee.batch.common;

import org.springframework.batch.core.job.parameters.JobParameters;

/** Job 하나의 실행 파라미터를 계산 */
public interface JobParametersProvider {

    /** 이 Provider가 파라미터를 만드는 Job 이름 */
    String jobName();

    /** 시계와 설정으로 계산한 파라미터 반환 */
    JobParameters create();
}
