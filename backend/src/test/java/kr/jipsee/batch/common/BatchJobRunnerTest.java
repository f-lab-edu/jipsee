package kr.jipsee.batch.common;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;
import kr.jipsee.global.publicdata.PublicDataApiException;
import kr.jipsee.global.publicdata.PublicDataQuotaExceededException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.JobInstance;
import org.springframework.batch.core.job.parameters.InvalidJobParametersException;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.launch.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.launch.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.batch.core.launch.JobRestartException;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.DefaultApplicationArguments;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class BatchJobRunnerTest {

    private static final String JOB_NAME = "initialSaleLoadJob";
    private static final JobParameters PARAMETERS = new JobParameters();

    @Mock
    Job job;

    @Mock
    JobParametersProvider provider;

    @Mock
    JobOperator jobOperator;

    @Mock
    JobRepository jobRepository;

    BatchJobRunner runner;
    ListAppender<ILoggingEvent> appender;
    Logger runnerLogger;

    @BeforeEach
    void setUp() {
        given(job.getName()).willReturn(JOB_NAME);
        given(provider.jobName()).willReturn(JOB_NAME);
        given(provider.create()).willReturn(PARAMETERS);
        runner = new BatchJobRunner(JOB_NAME, List.of(job), List.of(provider), jobOperator, jobRepository);

        runnerLogger = (Logger) LoggerFactory.getLogger(BatchJobRunner.class);
        appender = new ListAppender<>();
        appender.start();
        runnerLogger.addAppender(appender);
    }

    @AfterEach
    void tearDown() {
        runnerLogger.detachAppender(appender);
    }

    private static ApplicationArguments args(String... args) {
        return new DefaultApplicationArguments(args);
    }

    private static JobExecution execution(BatchStatus status, Throwable... failures) {
        JobExecution execution = new JobExecution(1L, new JobInstance(1L, JOB_NAME), PARAMETERS);
        execution.setStatus(status);
        for (Throwable failure : failures) {
            execution.addFailureException(failure);
        }
        return execution;
    }

    private List<String> endLines() {
        return appender.list.stream()
                .map(ILoggingEvent::getFormattedMessage)
                .filter(message -> message.startsWith("Job 종료:"))
                .toList();
    }

    private static String endLine(String status, int code) {
        return "Job 종료: " + JOB_NAME + " 상태 " + status + " 종료 코드 " + code;
    }

    @Nested
    @DisplayName("실행 전 검사")
    class BeforeStart {

        @Test
        @DisplayName("이름이 같은 Job이 없으면 종료 코드 2로 끝냄")
        void 이름이_같은_Job이_없으면_종료_코드_2로_끝냄() {
            // given
            BatchJobRunner noJob =
                    new BatchJobRunner(JOB_NAME, List.of(), List.of(provider), jobOperator, jobRepository);

            // when
            noJob.run(args());

            // then
            assertThat(noJob.getExitCode()).isEqualTo(BatchJobRunner.BAD_ARGS);
            assertThat(endLines()).containsExactly(endLine("없음", 2));
            then(jobOperator).shouldHaveNoInteractions();
        }

        @Test
        @DisplayName("파라미터 제공자가 없는 Job이면 종료 코드 2로 끝냄")
        void 파라미터_제공자가_없는_Job이면_종료_코드_2로_끝냄() {
            // given
            BatchJobRunner noProvider =
                    new BatchJobRunner(JOB_NAME, List.of(job), List.of(), jobOperator, jobRepository);

            // when
            noProvider.run(args());

            // then
            assertThat(noProvider.getExitCode()).isEqualTo(BatchJobRunner.BAD_ARGS);
            assertThat(endLines()).containsExactly(endLine("없음", 2));
        }

        @Test
        @DisplayName("파라미터 제공자가 IllegalArgumentException을 던지면 종료 코드 2로 끝냄")
        void 파라미터_제공자가_IllegalArgumentException을_던지면_종료_코드_2로_끝냄() {
            // given
            given(provider.create()).willThrow(new IllegalArgumentException("잘못된 값"));

            // when
            runner.run(args());

            // then
            assertThat(runner.getExitCode()).isEqualTo(BatchJobRunner.BAD_ARGS);
            assertThat(endLines()).containsExactly(endLine("없음", 2));
            then(jobOperator).shouldHaveNoInteractions();
        }
    }

    @Nested
    @DisplayName("STARTED 복구")
    class Recovery {

        @Test
        @DisplayName("Job을 시작하기 전에 STARTED로 남은 실행을 모두 복구함")
        void Job을_시작하기_전에_STARTED로_남은_실행을_모두_복구함() throws Exception {
            // given
            JobExecution first = execution(BatchStatus.STARTED);
            JobExecution second = new JobExecution(2L, new JobInstance(2L, JOB_NAME), PARAMETERS);
            given(jobRepository.findRunningJobExecutions(JOB_NAME))
                    .willReturn(new LinkedHashSet<>(List.of(first, second)));
            given(jobOperator.start(job, PARAMETERS)).willReturn(execution(BatchStatus.COMPLETED));

            // when
            runner.run(args());

            // then
            InOrder inOrder = inOrder(jobRepository, jobOperator);
            inOrder.verify(jobRepository).findRunningJobExecutions(JOB_NAME);
            inOrder.verify(jobOperator).recover(first);
            inOrder.verify(jobOperator).recover(second);
            inOrder.verify(jobOperator).start(job, PARAMETERS);
        }

        @Test
        @DisplayName("STARTED로 남은 실행이 없으면 복구하지 않음")
        void STARTED로_남은_실행이_없으면_복구하지_않음() throws Exception {
            // given
            given(jobRepository.findRunningJobExecutions(JOB_NAME)).willReturn(Set.of());
            given(jobOperator.start(job, PARAMETERS)).willReturn(execution(BatchStatus.COMPLETED));

            // when
            runner.run(args());

            // then
            then(jobOperator).should(never()).recover(any());
        }
    }

    static Stream<Arguments> results() {
        return Stream.of(
                Arguments.of(execution(BatchStatus.COMPLETED), "COMPLETED", BatchJobRunner.COMPLETED),
                Arguments.of(execution(BatchStatus.STOPPED), "STOPPED", BatchJobRunner.FAILED),
                Arguments.of(
                        execution(BatchStatus.FAILED, new PublicDataApiException("응답 이상")),
                        "FAILED",
                        BatchJobRunner.FAILED),
                Arguments.of(
                        execution(BatchStatus.FAILED, new PublicDataQuotaExceededException("호출 한도 초과(22)")),
                        "FAILED",
                        BatchJobRunner.QUOTA_EXCEEDED),
                Arguments.of(
                        execution(
                                BatchStatus.FAILED,
                                new IllegalStateException("감싼 예외", new PublicDataQuotaExceededException("22"))),
                        "FAILED",
                        BatchJobRunner.QUOTA_EXCEEDED),
                Arguments.of(execution(BatchStatus.ABANDONED), "ABANDONED", BatchJobRunner.FAILED));
    }

    @ParameterizedTest(name = "{1}, 종료 코드 {2}")
    @MethodSource("results")
    @DisplayName("Job 실행 결과를 종료 코드로 바꾸고 상태와 코드를 종료 줄에 한 번 출력함")
    void Job_실행_결과를_종료_코드로_바꾸고_상태와_코드를_종료_줄에_한_번_출력함(JobExecution execution, String status, int code) throws Exception {
        // given
        given(jobOperator.start(job, PARAMETERS)).willReturn(execution);

        // when
        runner.run(args());

        // then
        assertThat(runner.getExitCode()).isEqualTo(code);
        assertThat(endLines()).containsExactly(endLine(status, code));
    }

    static Stream<Arguments> startFailures() {
        return Stream.of(
                Arguments.of(new JobInstanceAlreadyCompleteException("이미 완료됨"), BatchJobRunner.COMPLETED),
                Arguments.of(new JobExecutionAlreadyRunningException("이미 실행 중임"), BatchJobRunner.FAILED),
                Arguments.of(new InvalidJobParametersException("잘못된 파라미터"), BatchJobRunner.BAD_ARGS),
                Arguments.of(new JobRestartException("재시작할 수 없음"), BatchJobRunner.FAILED),
                Arguments.of(new IllegalStateException("예상하지 못한 오류"), BatchJobRunner.FAILED));
    }

    @ParameterizedTest(name = "{0}, 종료 코드 {1}")
    @MethodSource("startFailures")
    @DisplayName("Job을 시작할 때 예외가 나면 종류에 맞는 종료 코드로 끝내고 종료 줄을 한 번 출력함")
    void Job을_시작할_때_예외가_나면_종류에_맞는_종료_코드로_끝내고_종료_줄을_한_번_출력함(Exception exception, int code) throws Exception {
        // given
        willThrow(exception).given(jobOperator).start(job, PARAMETERS);

        // when
        runner.run(args());

        // then
        assertThat(runner.getExitCode()).isEqualTo(code);
        assertThat(endLines()).containsExactly(endLine("없음", code));
    }
}
