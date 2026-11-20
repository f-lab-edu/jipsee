package kr.jipsee.batch.common;

import java.util.Collection;
import kr.jipsee.global.publicdata.PublicDataQuotaExceededException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.parameters.InvalidJobParametersException;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.launch.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Component;

/** 프로세스 하나에서 Job 하나를 실행하고 결과를 종료 코드로 돌려줌. SIGTERM이면 JVM이 143으로 끝나고 다음 실행이 STARTED를 복구해 이어서 처리 */
@Slf4j
@Component
@ConditionalOnExpression("#{environment.containsProperty('" + BatchJobRunner.RUN_JOB_PROPERTY + "')}")
public class BatchJobRunner implements ApplicationRunner, ExitCodeGenerator {
    /** 실행할 Job 이름을 받는 프로퍼티. 값이 비어 있거나 false여도 키가 있으면 러너를 만듦 */
    public static final String RUN_JOB_PROPERTY = "jipsee.batch.run.job";

    static final int COMPLETED = 0;
    static final int FAILED = 1;
    static final int BAD_ARGS = 2;
    static final int QUOTA_EXCEEDED = 75;

    /** Job 실행 기록이 없을 때 종료 줄의 상태 */
    static final String NO_EXECUTION = "없음";

    private final String jobName;
    private final Collection<Job> jobs;
    /** DealJobParametersConfig.java 에서 등록한 provider 빈 */
    private final Collection<JobParametersProvider> providers;

    private final JobOperator jobOperator;
    private final JobRepository jobRepository;

    private int exitCode = FAILED;

    public BatchJobRunner(
            @Value("${" + RUN_JOB_PROPERTY + "}") String jobName,
            Collection<Job> jobs,
            Collection<JobParametersProvider> providers,
            JobOperator jobOperator,
            JobRepository jobRepository) {
        this.jobName = jobName;
        this.jobs = jobs;
        this.providers = providers;
        this.jobOperator = jobOperator;
        this.jobRepository = jobRepository;
    }

    /** Job 하나를 실행하고 종료 줄을 한 번 출력. Loki 규칙이 종료 줄 문구를 사용하므로 바꾸지 않음 */
    @Override
    public void run(ApplicationArguments args) {
        String status = NO_EXECUTION;

        try {
            Job job = jobs.stream()
                    .filter(j -> jobName.equals(j.getName()))
                    .findFirst()
                    .orElse(null);
            JobParametersProvider provider = providers.stream()
                    .filter(p -> jobName.equals(p.jobName()))
                    .findFirst()
                    .orElse(null);

            if (job == null || provider == null) {
                exitCode = BAD_ARGS;
            } else {
                JobParameters parameters = provider.create();
                recoverStartedExecutions();
                JobExecution execution = jobOperator.start(job, parameters);
                status = String.valueOf(execution.getStatus());
                exitCode = toExitCode(execution);
            }
        } catch (JobInstanceAlreadyCompleteException e) {
            log.info("이미 완료된 Job이라 새 실행을 만들지 않음: {}", e.getMessage());
            exitCode = COMPLETED;
        } catch (IllegalArgumentException | InvalidJobParametersException e) {
            exitCode = BAD_ARGS;
        } catch (Exception e) {
            log.error("Job 실행 실패: {}", jobName, e);
            exitCode = FAILED;
        }

        log.info("Job 종료: {} 상태 {} 종료 코드 {}", jobName, status, exitCode);
    }

    /** 시작 전에 같은 Job 이름의 STARTED 실행을 모두 FAILED로 복구. Job마다 컨테이너 하나만 실행하므로 STARTED는 끊긴 실행임 */
    private void recoverStartedExecutions() {
        for (JobExecution started : jobRepository.findRunningJobExecutions(jobName)) {
            log.warn("STARTED로 남은 실행을 복구: 실행 ID {}", started.getId());
            jobOperator.recover(started);
        }
    }

    /** 종료 상태를 종료 코드로 변환. 한도 초과(22)가 실패 원인 사슬에 있으면 75 */
    private static int toExitCode(JobExecution execution) {
        if (execution.getStatus() == BatchStatus.COMPLETED) {
            return COMPLETED;
        }

        boolean quotaExceeded = execution.getAllFailureExceptions().stream().anyMatch(BatchJobRunner::hasQuotaCause);

        return quotaExceeded ? QUOTA_EXCEEDED : FAILED;
    }

    private static boolean hasQuotaCause(Throwable throwable) {
        for (Throwable cause = throwable; cause != null; cause = cause.getCause()) {
            if (cause instanceof PublicDataQuotaExceededException) {
                return true;
            }
        }

        return false;
    }

    @Override
    public int getExitCode() {
        return exitCode;
    }
}
