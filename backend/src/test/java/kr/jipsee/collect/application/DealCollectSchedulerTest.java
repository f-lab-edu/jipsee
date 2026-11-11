package kr.jipsee.collect.application;

import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

import java.time.Clock;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.stream.Stream;
import kr.jipsee.collect.config.CollectProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.launch.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.launch.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.batch.core.launch.JobRestartException;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class DealCollectSchedulerTest {

    // 2027-01-01 04:00 KST. UTC 날짜는 2026-12-31이라 시간대 오류를 검출함
    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-12-31T19:00:00Z"), ZoneId.of("Asia/Seoul"));

    @Mock
    JobOperator jobOperator;

    @Mock
    Job dailyRentJob;

    @Mock
    Job dailySaleJob;

    @Mock
    Job initialRentJob;

    @Mock
    Job initialSaleJob;

    DealCollectScheduler scheduler;

    @BeforeEach
    void setUp() {
        given(dailyRentJob.getName()).willReturn("dailyRentCollectJob");
        given(dailySaleJob.getName()).willReturn("dailySaleCollectJob");
        given(initialRentJob.getName()).willReturn("initialRentLoadJob");
        given(initialSaleJob.getName()).willReturn("initialSaleLoadJob");
        CollectProperties properties =
                new CollectProperties(new CollectProperties.Api("http://localhost", "key"), YearMonth.of(2026, 10));
        scheduler = new DealCollectScheduler(
                jobOperator, dailyRentJob, dailySaleJob, initialRentJob, initialSaleJob, properties, CLOCK);
    }

    // JobParameter.equals는 이름만 비교하므로 값은 matcher로 확인함
    private static JobParameters dailyParams() {
        return argThat(params -> "2027-01-01".equals(params.getString("collectDate")));
    }

    private static JobParameters initialParams() {
        return argThat(params -> "2026-10".equals(params.getString("endMonth")));
    }

    @Test
    @DisplayName("일일 Job 두 개를 실행일(KST) 수집 날짜로, 이어서 초기 적재 Job 두 개를 설정한 끝 월로 순서대로 시작함")
    void 일일_Job_두_개를_실행일_KST_수집_날짜로_이어서_초기_적재_Job_두_개를_설정한_끝_월로_순서대로_시작함() throws Exception {
        scheduler.collect();

        InOrder inOrder = inOrder(jobOperator);
        inOrder.verify(jobOperator).start(eq(dailyRentJob), dailyParams());
        inOrder.verify(jobOperator).start(eq(dailySaleJob), dailyParams());
        inOrder.verify(jobOperator).start(eq(initialRentJob), initialParams());
        inOrder.verify(jobOperator).start(eq(initialSaleJob), initialParams());
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    @DisplayName("각 Job을 한 번만 시작하고 재시작하지 않음")
    void 각_Job을_한_번만_시작하고_재시작하지_않음() throws Exception {
        scheduler.collect();

        then(jobOperator).should(times(4)).start(any(Job.class), any(JobParameters.class));
        then(jobOperator).should(never()).restart(any());
    }

    static Stream<Arguments> failures() {
        return Stream.of(0, 1, 2, 3)
                .flatMap(index -> Stream.<Exception>of(
                                new JobInstanceAlreadyCompleteException("이미 완료됨"),
                                new JobExecutionAlreadyRunningException("이미 실행 중임"),
                                new JobRestartException("재시작할 수 없음"),
                                new IllegalStateException("예상하지 못한 오류"))
                        .map(exception -> Arguments.of(index, exception)));
    }

    @ParameterizedTest(name = "{0}번째 Job, {1}")
    @MethodSource("failures")
    @DisplayName("어느 Job을 시작할 때 예외가 나도 나머지 Job을 시작하고 예외를 던지지 않음")
    void 어느_Job을_시작할_때_예외가_나도_나머지_Job을_시작하고_예외를_던지지_않음(int index, Exception exception) throws Exception {
        Job[] jobs = {dailyRentJob, dailySaleJob, initialRentJob, initialSaleJob};
        willThrow(exception).given(jobOperator).start(eq(jobs[index]), any());

        assertThatNoException().isThrownBy(scheduler::collect);

        for (Job job : jobs) {
            then(jobOperator).should().start(eq(job), any());
        }
    }
}
