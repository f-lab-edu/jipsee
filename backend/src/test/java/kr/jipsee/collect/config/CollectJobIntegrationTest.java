package kr.jipsee.collect.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.collect.application.SigunguCodes;
import kr.jipsee.collect.client.DealPage;
import kr.jipsee.collect.client.RentDealClient;
import kr.jipsee.collect.client.SaleDealClient;
import kr.jipsee.collect.exception.DealApiException;
import kr.jipsee.deal.dto.RentDealRow;
import kr.jipsee.deal.dto.SaleDealRow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.launch.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.launch.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class CollectJobIntegrationTest {

    private static final List<String> CODES = List.of("11110", "11140", "11170");

    @Autowired
    JobOperator jobOperator;

    @Autowired
    Job dailyRentCollectJob;

    @Autowired
    Job dailySaleCollectJob;

    @Autowired
    Job initialRentLoadJob;

    @Autowired
    Job initialSaleLoadJob;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @MockitoBean
    SigunguCodes sigunguCodes;

    @MockitoBean
    RentDealClient rentDealClient;

    @MockitoBean
    SaleDealClient saleDealClient;

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
        jdbcTemplate.update("delete from data_source");
        given(sigunguCodes.codes()).willReturn(CODES);
        given(rentDealClient.fetch(anyString(), any(YearMonth.class), anyInt())).willAnswer(invocation -> {
            YearMonth month = invocation.getArgument(1);
            return new DealPage<>("000", 1, List.of(rentRow(invocation.getArgument(0), month)));
        });
        given(saleDealClient.fetch(anyString(), any(YearMonth.class), anyInt())).willAnswer(invocation -> {
            YearMonth month = invocation.getArgument(1);
            return new DealPage<>("000", 1, List.of(saleRow(invocation.getArgument(0), month)));
        });
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

    private int count(String table) {
        return jdbcTemplate.queryForObject("select count(*) from " + table, Integer.class);
    }

    private List<String> sources() {
        return jdbcTemplate.queryForList("select source from data_source", String.class);
    }

    private static JobParameters endMonth(String value) {
        return new JobParametersBuilder().addString("endMonth", value).toJobParameters();
    }

    @Test
    @DisplayName("실패한 Job은 data_source를 갱신하지 않고 같은 파라미터로 다시 시작하면 마지막으로 커밋한 키부터 이어감")
    void 실패한_Job은_data_source를_갱신하지_않고_같은_파라미터로_다시_시작하면_마지막으로_커밋한_키부터_이어감() throws Exception {
        // given: 매매의 다섯 번째 키(11140, 2011-01)가 첫 호출에서만 실패함
        JobParameters params = endMonth("2011-02");
        given(saleDealClient.fetch("11140", YearMonth.of(2011, 1), 1))
                .willThrow(new DealApiException("테스트용 실패"))
                .willReturn(new DealPage<>("000", 1, List.of(saleRow("11140", YearMonth.of(2011, 1)))));

        // when
        JobExecution failed = jobOperator.start(initialSaleLoadJob, params);

        // then
        assertThat(failed.getStatus()).isEqualTo(BatchStatus.FAILED);
        assertThat(count("sale_deal")).isEqualTo(4); // 실패한 키 앞의 4개만 커밋함
        assertThat(sources()).isEmpty();

        // when
        JobExecution resumed = jobOperator.start(initialSaleLoadJob, params);

        // then
        assertThat(resumed.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        assertThat(count("sale_deal")).isEqualTo(186); // 2006-01부터 2011-02까지 62개월 x 3개 시군구
        assertThat(sources()).containsExactly("SALE_DEAL");
        then(saleDealClient).should(times(1)).fetch("11110", YearMonth.of(2011, 2), 1);
        then(saleDealClient).should(times(2)).fetch("11140", YearMonth.of(2011, 1), 1);
        then(saleDealClient).should(never()).fetch(anyString(), eq(YearMonth.of(2005, 12)), anyInt());
    }

    @Test
    @DisplayName("전월세 초기 적재 Job이 실패해도 매매 초기 적재 Job은 완료하고 data_source는 매매만 갱신함")
    void 전월세_초기_적재_Job이_실패해도_매매_초기_적재_Job은_완료하고_data_source는_매매만_갱신함() throws Exception {
        // given
        JobParameters params = endMonth("2011-02");
        given(rentDealClient.fetch(anyString(), any(YearMonth.class), anyInt()))
                .willThrow(new DealApiException("테스트용 실패"));

        // when
        JobExecution rent = jobOperator.start(initialRentLoadJob, params);
        JobExecution sale = jobOperator.start(initialSaleLoadJob, params);

        // then
        assertThat(rent.getStatus()).isEqualTo(BatchStatus.FAILED);
        assertThat(sale.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        assertThat(count("rent_deal")).isZero();
        assertThat(count("sale_deal")).isEqualTo(186);
        assertThat(sources()).containsExactly("SALE_DEAL");
    }

    @Test
    @DisplayName("STOPPED로 남은 실행은 같은 파라미터로 다시 시작하면 이어가고 STARTED로 남은 실행은 거부함")
    void STOPPED로_남은_실행은_같은_파라미터로_다시_시작하면_이어가고_STARTED로_남은_실행은_거부함() throws Exception {
        // given
        JobParameters params = endMonth("2011-02");
        given(saleDealClient.fetch("11140", YearMonth.of(2011, 1), 1))
                .willThrow(new DealApiException("테스트용 실패"))
                .willReturn(new DealPage<>("000", 1, List.of(saleRow("11140", YearMonth.of(2011, 1)))));
        JobExecution failed = jobOperator.start(initialSaleLoadJob, params);

        // when: STARTED로 남은 상태를 만듦
        jdbcTemplate.update(
                "update BATCH_JOB_EXECUTION set STATUS = 'STARTED', END_TIME = null where JOB_EXECUTION_ID = ?",
                failed.getId());
        Throwable running = catchThrowable(() -> jobOperator.start(initialSaleLoadJob, params));

        // then
        assertThat(running).isInstanceOf(JobExecutionAlreadyRunningException.class);

        // when: STOPPED로 남은 상태를 만듦
        jdbcTemplate.update(
                "update BATCH_JOB_EXECUTION set STATUS = 'STOPPED', END_TIME = now() where JOB_EXECUTION_ID = ?",
                failed.getId());
        JobExecution resumed = jobOperator.start(initialSaleLoadJob, params);

        // then
        assertThat(resumed.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        assertThat(count("sale_deal")).isEqualTo(186);
    }

    @Test
    @DisplayName("완료한 Job을 같은 파라미터로 다시 시작하면 거부함")
    void 완료한_Job을_같은_파라미터로_다시_시작하면_거부함() throws Exception {
        // given
        JobParameters params = endMonth("2006-02");
        JobExecution completed = jobOperator.start(initialSaleLoadJob, params);
        assertThat(completed.getStatus()).isEqualTo(BatchStatus.COMPLETED);

        // when
        Throwable thrown = catchThrowable(() -> jobOperator.start(initialSaleLoadJob, params));

        // then
        assertThat(thrown).isInstanceOf(JobInstanceAlreadyCompleteException.class);
        assertThat(count("sale_deal")).isEqualTo(6);
    }

    @Test
    @DisplayName("전월세 초기 적재는 첫 달 2011-01 앞의 달을 호출하지 않고 매매는 2006-01 앞의 달을 호출하지 않음")
    void 전월세_초기_적재는_첫_달_2011_01_앞의_달을_호출하지_않고_매매는_2006_01_앞의_달을_호출하지_않음() throws Exception {
        // given
        JobParameters params = endMonth("2011-02");

        // when
        jobOperator.start(initialRentLoadJob, params);
        jobOperator.start(initialSaleLoadJob, params);

        // then
        assertThat(count("rent_deal")).isEqualTo(6); // 2011-02, 2011-01 x 3개 시군구
        then(rentDealClient).should(never()).fetch(anyString(), eq(YearMonth.of(2010, 12)), anyInt());
        then(saleDealClient).should(never()).fetch(anyString(), eq(YearMonth.of(2005, 12)), anyInt());
        then(saleDealClient).should(times(1)).fetch("11110", YearMonth.of(2006, 1), 1);
    }

    @Test
    @DisplayName("일일 Job은 수집 날짜가 속한 달을 포함해 6개월을 각자의 API만 수집하고 data_source를 갱신함")
    void 일일_Job은_수집_날짜가_속한_달을_포함해_6개월을_각자의_API만_수집하고_data_source를_갱신함() throws Exception {
        // given
        JobParameters params = new JobParametersBuilder()
                .addString("collectDate", LocalDate.of(2026, 11, 4).toString())
                .toJobParameters();

        // when
        JobExecution rent = jobOperator.start(dailyRentCollectJob, params);

        // then
        assertThat(rent.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        assertThat(count("rent_deal")).isEqualTo(18);
        assertThat(count("sale_deal")).isZero();
        assertThat(sources()).containsExactly("RENT_DEAL");

        // when
        JobExecution sale = jobOperator.start(dailySaleCollectJob, params);

        // then
        assertThat(sale.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        assertThat(count("sale_deal")).isEqualTo(18);
        then(rentDealClient).should(times(1)).fetch("11170", YearMonth.of(2026, 6), 1);
        then(saleDealClient).should(times(1)).fetch("11170", YearMonth.of(2026, 6), 1);
        then(rentDealClient).should(never()).fetch(anyString(), eq(YearMonth.of(2026, 5)), anyInt());
        assertThat(sources()).containsExactlyInAnyOrder("RENT_DEAL", "SALE_DEAL");
    }
}
