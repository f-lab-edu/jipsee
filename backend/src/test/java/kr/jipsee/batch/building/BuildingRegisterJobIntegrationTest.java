package kr.jipsee.batch.building;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.batch.common.CollectStatusRepository;
import kr.jipsee.building.client.BldRgstHubClient;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.global.publicdata.PublicDataPage;
import kr.jipsee.global.publicdata.PublicDataQuotaExceededException;
import kr.jipsee.region.dto.LegalDongKey;
import kr.jipsee.region.service.RegionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
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
class BuildingRegisterJobIntegrationTest {

    private static final LegalDongKey A = new LegalDongKey("11350", "10100");
    private static final LegalDongKey B = new LegalDongKey("11350", "10400");
    private static final LegalDongKey C = new LegalDongKey("11350", "10500");

    private final AtomicInteger registerSeq = new AtomicInteger();

    @Autowired
    JobOperator jobOperator;

    @Autowired
    Job buildingRegisterJob;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    CollectStatusRepository collectStatusRepository;

    @MockitoBean
    RegionService regionService;

    @MockitoBean
    BldRgstHubClient bldRgstHubClient;

    @BeforeEach
    void setUp() {
        for (String table : List.of(
                "BATCH_STEP_EXECUTION_CONTEXT",
                "BATCH_STEP_EXECUTION",
                "BATCH_JOB_EXECUTION_CONTEXT",
                "BATCH_JOB_EXECUTION_PARAMS",
                "BATCH_JOB_EXECUTION",
                "BATCH_JOB_INSTANCE",
                "sale_deal",
                "rent_deal",
                "building_register",
                "building_parcel",
                "collect_status")) {
            jdbcTemplate.update("delete from " + table);
        }
        registerSeq.set(0);
        given(regionService.legalDongKeys()).willReturn(List.of(A, B, C));
        for (LegalDongKey key : List.of(A, B, C)) {
            givenNormalResponse(key);
        }
    }

    // 요청한 법정동의 코드를 가진 필지에 다세대주택 동 하나가 있는 한 건짜리 응답. 관리 키는 호출마다 다름
    private void givenNormalResponse(LegalDongKey key) {
        willAnswer(invocation -> new PublicDataPage<>("00", 1, List.of(row(key, registerSeq.incrementAndGet()))))
                .given(bldRgstHubClient)
                .fetch(key, 1);
    }

    private static BuildingRegisterRow row(LegalDongKey key, int seq) {
        return new BuildingRegisterRow(
                new ParcelKey(key.sigunguCode(), key.legalDongCode(), "0", "0001", "0000"),
                "MGM-" + key.code() + "-" + seq,
                "서울특별시 노원구 하계동 1",
                null,
                null,
                "A동",
                "0",
                "20040312",
                10,
                4,
                0,
                1,
                "철근콘크리트구조",
                "1",
                null,
                "다세대주택",
                0,
                0,
                0,
                0);
    }

    private int count(String table) {
        return jdbcTemplate.queryForObject("select count(*) from " + table, Integer.class);
    }

    private List<String> sources() {
        return jdbcTemplate.queryForList("select source from collect_status", String.class);
    }

    private List<String> registerKeys(LegalDongKey key) {
        return jdbcTemplate.queryForList(
                "select r.management_register_key from building_register r"
                        + " join building_parcel p on p.id = r.building_parcel_id"
                        + " where p.sigungu_code = ? and p.legal_dong_code = ?",
                String.class,
                key.sigunguCode(),
                key.legalDongCode());
    }

    private void insertParcel(LegalDongKey key) {
        jdbcTemplate.update(
                "insert into building_parcel (sigungu_code, legal_dong_code, land_type_code, main_lot_number,"
                        + " sub_lot_number) values (?, ?, '0', '0001', '0000')",
                key.sigunguCode(),
                key.legalDongCode());
    }

    private void insertRegister(LegalDongKey key, String managementKey) {
        jdbcTemplate.update(
                "insert into building_register (building_parcel_id, management_register_key, lot_address,"
                        + " main_annex_type_code) select id, ?, '서울특별시 노원구 하계동 1', '0' from building_parcel"
                        + " where sigungu_code = ? and legal_dong_code = ?",
                managementKey,
                key.sigunguCode(),
                key.legalDongCode());
    }

    private static JobParameters target(String value) {
        return new JobParametersBuilder()
                .addString(BuildingRegisterJobConfig.PARAM_TARGET, value)
                .toJobParameters();
    }

    @Test
    @DisplayName("첫 실행은 사전 전체를 조회하고 끝나면 collect_status에 BUILDING_REGISTER 행을 만듦")
    void 첫_실행은_사전_전체를_조회하고_끝나면_collect_status에_BUILDING_REGISTER_행을_만듦() throws Exception {
        // given
        JobParameters params = target(BuildingRegisterJobConfig.INITIAL_TARGET);

        // when
        JobExecution execution = jobOperator.start(buildingRegisterJob, params);

        // then
        assertThat(execution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        then(bldRgstHubClient).should(times(1)).fetch(A, 1);
        then(bldRgstHubClient).should(times(1)).fetch(B, 1);
        then(bldRgstHubClient).should(times(1)).fetch(C, 1);
        assertThat(count("building_parcel")).isEqualTo(3);
        assertThat(sources()).containsExactly("BUILDING_REGISTER");
    }

    @Test
    @DisplayName("한도 초과가 나면 Job이 실패하고 collect_status를 갱신하지 않음")
    void 한도_초과가_나면_Job이_실패하고_collect_status를_갱신하지_않음() throws Exception {
        // given
        given(bldRgstHubClient.fetch(B, 1)).willThrow(new PublicDataQuotaExceededException("테스트용 한도 초과"));

        // when
        JobExecution execution =
                jobOperator.start(buildingRegisterJob, target(BuildingRegisterJobConfig.INITIAL_TARGET));

        // then
        assertThat(execution.getStatus()).isEqualTo(BatchStatus.FAILED);
        assertThat(count("building_parcel")).isEqualTo(1);
        assertThat(sources()).isEmpty();
    }

    @Test
    @DisplayName("첫 적재를 이어갈 때 필지가 이미 저장되어 있어도 사전 전체를 대상으로 삼음")
    void 첫_적재를_이어갈_때_필지가_이미_저장되어_있어도_사전_전체를_대상으로_삼음() throws Exception {
        // given: B에서 실패해 A의 필지만 저장된 상태
        JobParameters params = target(BuildingRegisterJobConfig.INITIAL_TARGET);
        given(bldRgstHubClient.fetch(B, 1)).willThrow(new PublicDataQuotaExceededException("테스트용 한도 초과"));
        jobOperator.start(buildingRegisterJob, params);
        givenNormalResponse(B);

        // when
        JobExecution resumed = jobOperator.start(buildingRegisterJob, params);

        // then
        assertThat(resumed.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        then(bldRgstHubClient).should(times(1)).fetch(A, 1);
        then(bldRgstHubClient).should(times(2)).fetch(B, 1);
        then(bldRgstHubClient).should(times(1)).fetch(C, 1);
        assertThat(count("building_parcel")).isEqualTo(3);
        assertThat(sources()).containsExactly("BUILDING_REGISTER");
    }

    @Test
    @DisplayName("collect_status 행이 있으면 저장된 필지가 있는 법정동만 조회함")
    void collect_status_행이_있으면_저장된_필지가_있는_법정동만_조회함() throws Exception {
        // given
        collectStatusRepository.saveLoadedAt(BuildingRegisterJobConfig.SOURCE, LocalDateTime.of(2026, 11, 4, 4, 0));
        insertParcel(B);

        // when
        JobExecution execution = jobOperator.start(buildingRegisterJob, target("202612"));

        // then
        assertThat(execution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        then(bldRgstHubClient).should(times(1)).fetch(B, 1);
        then(bldRgstHubClient).should(never()).fetch(A, 1);
        then(bldRgstHubClient).should(never()).fetch(C, 1);
    }

    @Test
    @DisplayName("같은 파라미터로 완료된 Job을 다시 시작하면 거부함")
    void 같은_파라미터로_완료된_Job을_다시_시작하면_거부함() throws Exception {
        // given
        JobParameters params = target(BuildingRegisterJobConfig.INITIAL_TARGET);
        JobExecution completed = jobOperator.start(buildingRegisterJob, params);
        assertThat(completed.getStatus()).isEqualTo(BatchStatus.COMPLETED);

        // when
        Throwable thrown = catchThrowable(() -> jobOperator.start(buildingRegisterJob, params));

        // then
        assertThat(thrown).isInstanceOf(JobInstanceAlreadyCompleteException.class);
    }

    @Test
    @DisplayName("응답의 건수가 totalCount와 다르면 Job이 실패하고 다시 시작하면 그 법정동부터 이어감")
    void 응답의_건수가_totalCount와_다르면_Job이_실패하고_다시_시작하면_그_법정동부터_이어감() throws Exception {
        // given: B에 기존 동이 있고 B의 응답이 totalCount 5에 1건뿐임
        JobParameters params = target(BuildingRegisterJobConfig.INITIAL_TARGET);
        insertParcel(B);
        insertRegister(B, "EXISTING-B");
        given(bldRgstHubClient.fetch(B, 1))
                .willReturn(new PublicDataPage<>("00", 5, List.of(row(B, registerSeq.incrementAndGet()))));
        given(bldRgstHubClient.fetch(B, 2)).willReturn(new PublicDataPage<>("00", 5, List.of()));

        // when
        JobExecution failed = jobOperator.start(buildingRegisterJob, params);

        // then
        assertThat(failed.getStatus()).isEqualTo(BatchStatus.FAILED);
        assertThat(count("building_parcel")).isEqualTo(2); // A와 기존 B
        assertThat(registerKeys(B)).containsExactly("EXISTING-B");
        assertThat(sources()).isEmpty();

        // given
        givenNormalResponse(B);

        // when
        JobExecution resumed = jobOperator.start(buildingRegisterJob, params);

        // then
        assertThat(resumed.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        then(bldRgstHubClient).should(times(1)).fetch(A, 1);
        then(bldRgstHubClient).should(times(1)).fetch(C, 1);
        assertThat(sources()).containsExactly("BUILDING_REGISTER");
    }

    @Test
    @DisplayName("응답이 0건인 법정동은 아무것도 저장하지 않고 Job은 계속됨")
    void 응답이_0건인_법정동은_아무것도_저장하지_않고_Job은_계속됨() throws Exception {
        // given
        given(bldRgstHubClient.fetch(C, 1)).willReturn(new PublicDataPage<>("00", 0, List.of()));

        // when
        JobExecution execution =
                jobOperator.start(buildingRegisterJob, target(BuildingRegisterJobConfig.INITIAL_TARGET));

        // then
        assertThat(execution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        assertThat(jdbcTemplate.queryForObject(
                        "select count(*) from building_parcel where legal_dong_code = ?",
                        Integer.class,
                        C.legalDongCode()))
                .isZero();
        assertThat(count("building_parcel")).isEqualTo(2);
    }

    @Test
    @DisplayName("저장된 동이 있는 법정동이 0건을 받으면 교체하지 않고 기존 동을 유지함")
    void 저장된_동이_있는_법정동이_0건을_받으면_교체하지_않고_기존_동을_유지함() throws Exception {
        // given
        collectStatusRepository.saveLoadedAt(BuildingRegisterJobConfig.SOURCE, LocalDateTime.of(2026, 11, 4, 4, 0));
        insertParcel(B);
        insertRegister(B, "EXISTING-B");
        given(bldRgstHubClient.fetch(B, 1)).willReturn(new PublicDataPage<>("00", 0, List.of()));

        // when
        JobExecution execution = jobOperator.start(buildingRegisterJob, target("202612"));

        // then
        assertThat(execution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        assertThat(registerKeys(B)).containsExactly("EXISTING-B");
        then(bldRgstHubClient).should(never()).fetch(B, 2);
        then(bldRgstHubClient).should(times(1)).fetch(B, 1);
        then(bldRgstHubClient).should(never()).fetch(eq(A), anyInt());
    }
}
