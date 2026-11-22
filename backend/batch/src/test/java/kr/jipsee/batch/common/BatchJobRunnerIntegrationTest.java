package kr.jipsee.batch.common;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Collection;
import java.util.List;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.batch.deal.client.RtmsRhRentClient;
import kr.jipsee.batch.deal.client.RtmsRhTradeClient;
import kr.jipsee.batch.publicdata.PublicDataApiException;
import kr.jipsee.batch.publicdata.PublicDataPage;
import kr.jipsee.batch.publicdata.PublicDataQuotaExceededException;
import kr.jipsee.deal.dto.RentDealRow;
import kr.jipsee.deal.dto.SaleDealRow;
import kr.jipsee.deal.service.CollectStatusService;
import kr.jipsee.region.RegionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

@SpringBootTest(properties = "jipsee.batch.deal.initial-load-end-month=2011-02")
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class BatchJobRunnerIntegrationTest {

    private static final String SALE_JOB = "initialSaleLoadJob";
    private static final List<String> CODES = List.of("11110", "11140", "11170");

    @Autowired
    Collection<Job> jobs;

    @Autowired
    Collection<JobParametersProvider> providers;

    @Autowired
    JobOperator jobOperator;

    @Autowired
    JobRepository jobRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @MockitoBean
    RegionService regionService;

    @MockitoBean
    RtmsRhRentClient rtmsRhRentClient;

    @MockitoBean
    RtmsRhTradeClient rtmsRhTradeClient;

    @MockitoSpyBean
    CollectStatusService collectStatusService;

    @BeforeEach
    void setUp() {
        for (String table : List.of(
                "BATCH_STEP_EXECUTION_CONTEXT",
                "BATCH_STEP_EXECUTION",
                "BATCH_JOB_EXECUTION_CONTEXT",
                "BATCH_JOB_EXECUTION_PARAMS",
                "BATCH_JOB_EXECUTION",
                "BATCH_JOB_INSTANCE")) {
            jdbcTemplate.update("delete from " + table);
        }
        jdbcTemplate.update("delete from rent_deal");
        jdbcTemplate.update("delete from sale_deal");
        jdbcTemplate.update("delete from collect_status");
        given(regionService.sigunguCodes()).willReturn(CODES);
        given(rtmsRhRentClient.fetch(anyString(), any(YearMonth.class), anyInt()))
                .willAnswer(invocation -> new PublicDataPage<>(
                        "000", 1, List.of(rentRow(invocation.getArgument(0), invocation.getArgument(1)))));
        given(rtmsRhTradeClient.fetch(anyString(), any(YearMonth.class), anyInt()))
                .willAnswer(invocation -> new PublicDataPage<>(
                        "000", 1, List.of(saleRow(invocation.getArgument(0), invocation.getArgument(1)))));
    }

    private static RentDealRow rentRow(String sigunguCode, YearMonth month) {
        return new RentDealRow(
                sigunguCode,
                "동숭동",
                "130-69",
                null,
                2004,
                new BigDecimal("69.99"),
                4,
                month.atDay(1),
                31000,
                0,
                null,
                null,
                null,
                null,
                null);
    }

    private static SaleDealRow saleRow(String sigunguCode, YearMonth month) {
        return new SaleDealRow(
                sigunguCode, "이창동", "745-5", null, 2007, new BigDecimal("74.89"), 2, month.atDay(1), 4800, null, null);
    }

    private BatchJobRunner runner(String jobName) {
        return new BatchJobRunner(jobName, jobs, providers, jobOperator, jobRepository);
    }

    private BatchJobRunner run(String jobName) {
        BatchJobRunner runner = runner(jobName);
        runner.run(new DefaultApplicationArguments());
        return runner;
    }

    private int count(String table) {
        return jdbcTemplate.queryForObject("select count(*) from " + table, Integer.class);
    }

    private String jobExecutionStatus(long id) {
        return jdbcTemplate.queryForObject(
                "select status from BATCH_JOB_EXECUTION where JOB_EXECUTION_ID = ?", String.class, id);
    }

    /** 매매 키(11140, 2011-01)의 첫 호출만 실패시킴. 앞의 키 4개는 커밋됨 */
    private void failSaleKeyOnce(Throwable failure) {
        given(rtmsRhTradeClient.fetch("11140", YearMonth.of(2011, 1), 1))
                .willThrow(failure)
                .willReturn(new PublicDataPage<>("000", 1, List.of(saleRow("11140", YearMonth.of(2011, 1)))));
    }

    /** 첫 실행이 실패한 뒤 실행 기록을 STARTED로 되돌려 프로세스가 끊긴 상태를 만들고 실행 ID를 반환 */
    private long startAndLeaveStarted() throws Exception {
        JobParameters parameters =
                new JobParametersBuilder().addString("endMonth", "2011-02").toJobParameters();
        Job job = jobs.stream()
                .filter(j -> SALE_JOB.equals(j.getName()))
                .findFirst()
                .orElseThrow();
        long id = jobOperator.start(job, parameters).getId();
        jdbcTemplate.update(
                "update BATCH_JOB_EXECUTION set STATUS = 'STARTED', END_TIME = null where JOB_EXECUTION_ID = ?", id);
        jdbcTemplate.update(
                "update BATCH_STEP_EXECUTION set STATUS = 'STARTED', END_TIME = null"
                        + " where JOB_EXECUTION_ID = ? and STATUS = 'FAILED'",
                id);
        return id;
    }

    @Test
    @DisplayName("모든 Job 빈에는 이름이 같은 파라미터 제공자가 있음")
    void 모든_Job_빈에는_이름이_같은_파라미터_제공자가_있음() {
        assertThat(providers.stream().map(JobParametersProvider::jobName))
                .containsExactlyInAnyOrderElementsOf(
                        jobs.stream().map(Job::getName).toList());
    }

    @Test
    @DisplayName("Job을 끝까지 실행하면 종료 코드 0")
    void Job을_끝까지_실행하면_종료_코드_0() {
        // when
        BatchJobRunner runner = run(SALE_JOB);

        // then
        assertThat(runner.getExitCode()).isEqualTo(BatchJobRunner.COMPLETED);
        assertThat(count("sale_deal")).isEqualTo(186);
    }

    @Test
    @DisplayName("이미 완료한 Job을 다시 실행하면 종료 코드 0이고 새 실행 기록을 만들지 않음")
    void 이미_완료한_Job을_다시_실행하면_종료_코드_0이고_새_실행_기록을_만들지_않음() {
        // given
        run(SALE_JOB);
        int executions = count("BATCH_JOB_EXECUTION");

        // when
        BatchJobRunner runner = run(SALE_JOB);

        // then
        assertThat(runner.getExitCode()).isEqualTo(BatchJobRunner.COMPLETED);
        assertThat(count("BATCH_JOB_EXECUTION")).isEqualTo(executions);
    }

    @Test
    @DisplayName("한도 초과(22)로 실패하면 종료 코드 75이고 다시 실행하면 이어서 완료해 종료 코드 0")
    void 한도_초과_22로_실패하면_종료_코드_75이고_다시_실행하면_이어서_완료해_종료_코드_0() {
        // given
        failSaleKeyOnce(new PublicDataQuotaExceededException("호출 한도 초과(22)"));

        // when
        BatchJobRunner first = run(SALE_JOB);

        // then
        assertThat(first.getExitCode()).isEqualTo(BatchJobRunner.QUOTA_EXCEEDED);
        assertThat(count("sale_deal")).isEqualTo(4);

        // when
        BatchJobRunner second = run(SALE_JOB);

        // then
        assertThat(second.getExitCode()).isEqualTo(BatchJobRunner.COMPLETED);
        assertThat(count("sale_deal")).isEqualTo(186);
        then(rtmsRhTradeClient).should(times(2)).fetch("11140", YearMonth.of(2011, 1), 1);
    }

    @Test
    @DisplayName("한도 초과가 아닌 오류로 실패하면 종료 코드 1")
    void 한도_초과가_아닌_오류로_실패하면_종료_코드_1() {
        // given
        failSaleKeyOnce(new PublicDataApiException("테스트용 실패"));

        // when
        BatchJobRunner runner = run(SALE_JOB);

        // then
        assertThat(runner.getExitCode()).isEqualTo(BatchJobRunner.FAILED);
    }

    @Test
    @DisplayName("STARTED로 남은 실행은 FAILED로 복구하고 마지막 커밋 위치부터 이어서 완료함")
    void STARTED로_남은_실행은_FAILED로_복구하고_마지막_커밋_위치부터_이어서_완료함() throws Exception {
        // given
        failSaleKeyOnce(new PublicDataApiException("테스트용 실패"));
        long staleId = startAndLeaveStarted();

        // when
        BatchJobRunner runner = run(SALE_JOB);

        // then
        assertThat(runner.getExitCode()).isEqualTo(BatchJobRunner.COMPLETED);
        assertThat(jobExecutionStatus(staleId)).isEqualTo("FAILED");
        assertThat(count("sale_deal")).isEqualTo(186);
        then(rtmsRhTradeClient).should(times(2)).fetch("11140", YearMonth.of(2011, 1), 1);
        then(rtmsRhTradeClient).should(times(1)).fetch("11110", YearMonth.of(2011, 2), 1);
    }
}
