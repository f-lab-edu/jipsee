// Copy-paste starting point for triggering a Spring Batch 6 job on a schedule.
// Pair with application.yml:
//   spring.batch.job.enabled: false              # don't auto-run jobs on startup
//   spring.batch.jdbc.initialize-schema: never   # BATCH_* schema is applied outside the repo (all profiles)
//
// Single Spring instance: no ShedLock, @Scheduled is enough.
// JobOperator (Boot's) is SYNCHRONOUS by default: start(...) blocks until the job finishes.
// Duplicate runs are prevented by the deterministic identifying param (runDate) on a DB job repository.
// Do NOT add an incrementer or run.id = currentTimeMillis: that defeats the guard.

import java.time.LocalDate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.JobExecutionException;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.launch.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.launch.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class JobScheduler {

    private final JobOperator jobOperator;
    private final Job exampleJob;

    @Scheduled(cron = "0 0 2 * * *") // 02:00 daily
    public void run() {
        JobParameters params = new JobParametersBuilder()
            .addString("status", "COMPLETED")                         // identifying: part of the JobInstance key
            .addString("runDate", LocalDate.now().toString())         // identifying + deterministic: one instance per day
            // .addString("requestId", id, false)                     // non-identifying: logged, not part of the key
            .toJobParameters();

        try {
            JobExecution execution = jobOperator.start(exampleJob, params);
            log.info("Job {} finished with status {}", exampleJob.getName(), execution.getStatus());
        } catch (JobInstanceAlreadyCompleteException e) {
            log.info("Job {} already completed for {}", exampleJob.getName(), params.getString("runDate")); // expected duplicate
        } catch (JobExecutionAlreadyRunningException e) {
            log.warn("Job {} is still running for {}", exampleJob.getName(), params.getString("runDate"));
        } catch (JobExecutionException e) {
            // InvalidJobParametersException, JobRestartException, etc.
            log.error("Failed to launch {}", exampleJob.getName(), e);
        }
    }
}
