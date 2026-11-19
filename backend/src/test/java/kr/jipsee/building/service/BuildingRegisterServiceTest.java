package kr.jipsee.building.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.region.dto.LegalDongKey;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class BuildingRegisterServiceTest {

    private static final LegalDongKey KEY = new LegalDongKey("11350", "10400");
    private static final LegalDongKey OTHER_KEY = new LegalDongKey("11350", "10500");
    private static final ParcelKey P1 = parcel("10400", "0067");
    private static final ParcelKey P2 = parcel("10400", "0068");
    private static final ParcelKey P3 = parcel("10400", "0069");

    @Autowired
    BuildingRegisterService service;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from sale_deal");
        jdbcTemplate.update("delete from rent_deal");
        jdbcTemplate.update("delete from building_register");
        jdbcTemplate.update("delete from building_parcel");
    }

    private void replace(LegalDongKey key, List<BuildingRegisterRow> rows) {
        service.replaceByLegalDong(key, rows, Set.of());
    }

    private static ParcelKey parcel(String legalDongCode, String mainLotNumber) {
        return new ParcelKey("11350", legalDongCode, "0", mainLotNumber, "0000");
    }

    private static BuildingRegisterRow row(ParcelKey parcelKey, String managementKey, String name, String etcPurpose) {
        return row(parcelKey, managementKey, name, etcPurpose, 10);
    }

    private static BuildingRegisterRow row(
            ParcelKey parcelKey, String managementKey, String name, String etcPurpose, int householdCount) {
        return rowWithLotAddress(parcelKey, managementKey, name, etcPurpose, householdCount, "서울특별시 노원구 하계동 67-22");
    }

    private static BuildingRegisterRow rowWithLotAddress(
            ParcelKey parcelKey,
            String managementKey,
            String name,
            String etcPurpose,
            int householdCount,
            String lotAddress) {
        return new BuildingRegisterRow(
                parcelKey,
                managementKey,
                lotAddress,
                null,
                name,
                "A동",
                "0",
                "20040312",
                householdCount,
                4,
                0,
                1,
                "철근콘크리트구조",
                "1",
                new BigDecimal("100.0000"),
                etcPurpose,
                0,
                0,
                0,
                0);
    }

    // 동 이름과 건물명이 없는 행
    private static BuildingRegisterRow unnamedRow(ParcelKey parcelKey, String managementKey) {
        return new BuildingRegisterRow(
                parcelKey,
                managementKey,
                "서울특별시 노원구 하계동 67-22",
                null,
                null,
                null,
                "0",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                "다세대주택",
                null,
                null,
                null,
                null);
    }

    // 컬럼 20개가 서로 다르고 seed가 다르면 모든 컬럼이 다른 값을 가진 행(두 코드 컬럼은 행 안에서 서로 다름)
    private static BuildingRegisterRow fullRow(ParcelKey parcelKey, String managementKey, int seed) {
        return new BuildingRegisterRow(
                parcelKey,
                managementKey,
                "주소" + seed,
                "도로명" + seed,
                "건물" + seed,
                "동" + seed,
                String.valueOf(seed % 2),
                "200" + seed + "0101",
                seed * 10 + 1,
                seed * 10 + 2,
                seed * 10 + 3,
                seed * 10 + 4,
                "구조" + seed,
                String.valueOf(1 - seed % 2),
                new BigDecimal(seed * 1000 + ".1234"),
                "다세대" + seed,
                seed * 10 + 5,
                seed * 10 + 6,
                seed * 10 + 7,
                seed * 10 + 8);
    }

    private int count(String table) {
        return jdbcTemplate.queryForObject("select count(*) from " + table, Integer.class);
    }

    private long parcelId(ParcelKey key) {
        return jdbcTemplate.queryForObject(
                "select id from building_parcel where sigungu_code = ? and legal_dong_code = ? and land_type_code = ?"
                        + " and main_lot_number = ? and sub_lot_number = ?",
                Long.class,
                key.sigunguCode(),
                key.legalDongCode(),
                key.landTypeCode(),
                key.mainLotNumber(),
                key.subLotNumber());
    }

    private String parcelName(ParcelKey key) {
        return jdbcTemplate.queryForObject(
                "select name from building_parcel where id = ?", String.class, parcelId(key));
    }

    private Map<String, Object> registerOf(String managementKey) {
        return jdbcTemplate.queryForMap(
                "select * from building_register where management_register_key = ?", managementKey);
    }

    private int registerCountOf(ParcelKey key) {
        return jdbcTemplate.queryForObject(
                "select count(*) from building_register where building_parcel_id = ?", Integer.class, parcelId(key));
    }

    // 컬럼 20개를 하나씩 비교함
    private void assertRegisterColumns(Map<String, Object> actual, BuildingRegisterRow expected, long parcelId) {
        assertThat(actual.get("building_parcel_id")).isEqualTo(parcelId);
        assertThat(actual.get("management_register_key")).isEqualTo(expected.managementRegisterKey());
        assertThat(actual.get("lot_address")).isEqualTo(expected.lotAddress());
        assertThat(actual.get("road_address")).isEqualTo(expected.roadAddress());
        assertThat(actual.get("name")).isEqualTo(expected.name());
        assertThat(actual.get("dong_name")).isEqualTo(expected.dongName());
        assertThat(actual.get("main_annex_type_code")).isEqualTo(expected.mainAnnexTypeCode());
        assertThat(actual.get("use_approval_date")).isEqualTo(expected.useApprovalDate());
        assertThat(actual.get("household_count")).isEqualTo(expected.householdCount());
        assertThat(actual.get("above_ground_floor_count")).isEqualTo(expected.aboveGroundFloorCount());
        assertThat(actual.get("underground_floor_count")).isEqualTo(expected.undergroundFloorCount());
        assertThat(actual.get("passenger_elevator_count")).isEqualTo(expected.passengerElevatorCount());
        assertThat(actual.get("structure_name")).isEqualTo(expected.structureName());
        assertThat(actual.get("earthquake_design_applied")).isEqualTo(expected.earthquakeDesignApplied());
        assertThat((BigDecimal) actual.get("total_floor_area")).isEqualByComparingTo(expected.totalFloorArea());
        assertThat(actual.get("etc_purpose")).isEqualTo(expected.etcPurpose());
        assertThat(actual.get("indoor_mechanical_parking_count")).isEqualTo(expected.indoorMechanicalParkingCount());
        assertThat(actual.get("outdoor_mechanical_parking_count")).isEqualTo(expected.outdoorMechanicalParkingCount());
        assertThat(actual.get("indoor_self_propelled_parking_count"))
                .isEqualTo(expected.indoorSelfPropelledParkingCount());
        assertThat(actual.get("outdoor_self_propelled_parking_count"))
                .isEqualTo(expected.outdoorSelfPropelledParkingCount());
    }

    @Test
    @DisplayName("etcPurps에 키워드가 없는 필지는 저장하지 않음")
    void etcPurps에_키워드가_없는_필지는_저장하지_않음() {
        // given
        List<BuildingRegisterRow> rows = List.of(row(P1, "K1", "가빌라", "단독주택"), row(P1, "K2", null, null));

        // when
        replace(KEY, rows);

        // then
        assertThat(count("building_parcel")).isZero();
        assertThat(count("building_register")).isZero();
    }

    @Test
    @DisplayName("필지에 연립 또는 다세대 동이 하나라도 있으면 그 필지의 모든 동을 저장함")
    void 필지에_연립_또는_다세대_동이_하나라도_있으면_그_필지의_모든_동을_저장함() {
        // given
        List<BuildingRegisterRow> rows =
                List.of(row(P1, "K1", "가빌라", "다세대주택"), row(P1, "K2", "가빌라", null), row(P1, "K3", "가빌라", "근린생활시설"));

        // when
        replace(KEY, rows);

        // then
        assertThat(count("building_parcel")).isEqualTo(1);
        assertThat(count("building_register")).isEqualTo(3);
    }

    @Test
    @DisplayName("키워드는 부분 일치로 찾음")
    void 키워드는_부분_일치로_찾음() {
        // given
        List<BuildingRegisterRow> rows =
                List.of(row(P1, "K1", null, "공동주택(다세대주택)"), row(P2, "K2", null, "연립주택"), row(P3, "K3", null, "다세대"));

        // when
        replace(KEY, rows);

        // then
        assertThat(count("building_parcel")).isEqualTo(3);
        assertThat(count("building_register")).isEqualTo(3);
    }

    @Test
    @DisplayName("같은 법정동을 다시 교체해도 필지 id가 바뀌지 않고 rent_deal의 참조가 유지됨")
    void 같은_법정동을_다시_교체해도_필지_id가_바뀌지_않고_rent_deal의_참조가_유지됨() {
        // given
        replace(KEY, List.of(row(P1, "K1", "가빌라", "다세대주택")));
        long parcelId = parcelId(P1);
        jdbcTemplate.update(
                "insert into rent_deal (sigungu_code, legal_dong_name, lot_number, exclusive_area, deal_date, deposit,"
                        + " monthly_rent, building_parcel_id, match_status)"
                        + " values ('11350', '하계동', '67-22', 59.99, '2026-10-01', 10000, 0, ?, 'CONFIRMED')",
                parcelId);

        // when
        replace(KEY, List.of(row(P1, "K1", "가빌라", "다세대주택", 20)));

        // then
        assertThat(parcelId(P1)).isEqualTo(parcelId);
        assertThat(jdbcTemplate.queryForObject("select building_parcel_id from rent_deal", Long.class))
                .isEqualTo(parcelId);
    }

    @Test
    @DisplayName("새 동은 삽입하고 바뀐 동은 수정하고 응답에 없는 동은 삭제함")
    void 새_동은_삽입하고_바뀐_동은_수정하고_응답에_없는_동은_삭제함() {
        // given
        replace(KEY, List.of(row(P1, "A", "가빌라", "다세대주택", 5), row(P1, "B", "가빌라", "다세대주택", 6)));
        Long idOfA = (Long) registerOf("A").get("id");

        // when
        replace(KEY, List.of(row(P1, "A", "가빌라", "다세대주택", 9), row(P1, "C", "가빌라", "다세대주택", 7)));

        // then
        assertThat(registerOf("A").get("id")).isEqualTo(idOfA);
        assertThat(registerOf("A").get("household_count")).isEqualTo(9);
        assertThat(jdbcTemplate.queryForList(
                        "select management_register_key from building_register order by management_register_key",
                        String.class))
                .containsExactly("A", "C");
    }

    @Test
    @DisplayName("같은 응답을 두 번 교체해도 행 수가 같음")
    void 같은_응답을_두_번_교체해도_행_수가_같음() {
        // given
        List<BuildingRegisterRow> rows =
                List.of(row(P1, "K1", "가빌라", "다세대주택"), row(P1, "K2", "가빌라", "다세대주택"), row(P2, "K3", null, "연립주택"));

        // when
        replace(KEY, rows);
        replace(KEY, rows);

        // then
        assertThat(count("building_parcel")).isEqualTo(2);
        assertThat(count("building_register")).isEqualTo(3);
    }

    @Test
    @DisplayName("저장된 필지는 키워드가 없어져도 삭제하지 않고 동을 계속 갱신함")
    void 저장된_필지는_키워드가_없어져도_삭제하지_않고_동을_계속_갱신함() {
        // given
        replace(KEY, List.of(row(P1, "K1", "가빌라", "다세대주택", 10)));

        // when
        replace(KEY, List.of(row(P1, "K1", "가빌라", "단독주택", 20)));

        // then
        assertThat(count("building_parcel")).isEqualTo(1);
        assertThat(registerOf("K1").get("household_count")).isEqualTo(20);
        assertThat(registerOf("K1").get("etc_purpose")).isEqualTo("단독주택");
    }

    @Test
    @DisplayName("키워드가 없는 새 필지는 같은 교체에서도 저장하지 않음")
    void 키워드가_없는_새_필지는_같은_교체에서도_저장하지_않음() {
        // given
        replace(KEY, List.of(row(P1, "K1", "가빌라", "다세대주택")));

        // when
        replace(KEY, List.of(row(P1, "K1", "가빌라", "다세대주택"), row(P2, "K2", null, "단독주택")));

        // then
        assertThat(count("building_parcel")).isEqualTo(1);
        assertThat(count("building_register")).isEqualTo(1);
    }

    @Test
    @DisplayName("응답에 없는 필지의 동은 삭제하고 필지는 남김")
    void 응답에_없는_필지의_동은_삭제하고_필지는_남김() {
        // given
        replace(KEY, List.of(row(P1, "K1", "가빌라", "다세대주택"), row(P2, "K2", "나빌라", "다세대주택")));
        assertThat(parcelName(P1)).isEqualTo("가빌라");

        // when
        replace(KEY, List.of(row(P2, "K2", "나빌라", "다세대주택")));

        // then
        assertThat(count("building_parcel")).isEqualTo(2);
        assertThat(registerCountOf(P1)).isZero();
        assertThat(parcelName(P1)).isNull();
        assertThat(registerCountOf(P2)).isEqualTo(1);
        assertThat(parcelName(P2)).isEqualTo("나빌라");
    }

    @Test
    @DisplayName("유지할 관리 키의 동은 응답에 없어도 삭제하지 않음")
    void 유지할_관리_키의_동은_응답에_없어도_삭제하지_않음() {
        // given
        replace(
                KEY,
                List.of(row(P1, "K1", "가빌라", "다세대주택"), row(P1, "K2", "가빌라", "다세대주택"), row(P1, "K3", "가빌라", "다세대주택")));

        // when
        service.replaceByLegalDong(KEY, List.of(row(P1, "K1", "가빌라", "다세대주택")), Set.of("K2"));

        // then
        List<String> keys = jdbcTemplate.queryForList(
                "select management_register_key from building_register order by management_register_key", String.class);
        assertThat(keys).containsExactly("K1", "K2");
    }

    @Test
    @DisplayName("다른 법정동의 행은 지우지 않음")
    void 다른_법정동의_행은_지우지_않음() {
        // given
        ParcelKey otherParcel = parcel("10500", "0001");
        replace(KEY, List.of(row(P1, "K1", "가빌라", "다세대주택")));
        replace(OTHER_KEY, List.of(row(otherParcel, "K9", "나빌라", "다세대주택")));

        // when
        replace(KEY, List.of(row(P2, "K2", "다빌라", "다세대주택")));

        // then
        assertThat(registerCountOf(otherParcel)).isEqualTo(1);
        assertThat(parcelName(otherParcel)).isEqualTo("나빌라");
        assertThat(count("building_parcel")).isEqualTo(3);
    }

    @Test
    @DisplayName("법정동의 저장된 동 개수를 셈")
    void 법정동의_저장된_동_개수를_셈() {
        // given
        assertThat(service.countRegisters(KEY)).isZero();
        replace(KEY, List.of(row(P1, "K1", null, "다세대주택"), row(P1, "K2", null, "다세대주택"), row(P2, "K3", null, "다세대주택")));
        replace(OTHER_KEY, List.of(row(parcel("10500", "0001"), "K9", null, "다세대주택")));

        // when
        int count = service.countRegisters(KEY);

        // then
        assertThat(count).isEqualTo(3);
        assertThat(service.countRegisters(new LegalDongKey("11350", "10600"))).isZero();
    }

    @Test
    @DisplayName("name은 건물명이 있는 동 중 id가 가장 작은 동의 건물명임")
    void name은_건물명이_있는_동_중_id가_가장_작은_동의_건물명임() {
        // given
        List<BuildingRegisterRow> rows =
                List.of(row(P1, "K1", null, "다세대주택"), row(P1, "K2", "나빌라", "다세대주택"), row(P1, "K3", "가빌라", "다세대주택"));

        // when
        replace(KEY, rows);

        // then
        assertThat(parcelName(P1)).isEqualTo("나빌라");
    }

    @Test
    @DisplayName("건물명이 있는 동이 없으면 name은 null이고 건물명이 바뀌면 갱신함")
    void 건물명이_있는_동이_없으면_name은_null이고_건물명이_바뀌면_갱신함() {
        // given
        replace(KEY, List.of(row(P1, "K1", null, "다세대주택"), row(P1, "K2", null, "다세대주택")));
        assertThat(parcelName(P1)).isNull();

        // when
        replace(KEY, List.of(row(P1, "K1", null, "다세대주택"), row(P1, "K2", "가빌라", "다세대주택")));
        String named = parcelName(P1);
        replace(KEY, List.of(row(P1, "K1", null, "다세대주택"), row(P1, "K2", "다빌라", "다세대주택")));

        // then
        assertThat(named).isEqualTo("가빌라");
        assertThat(parcelName(P1)).isEqualTo("다빌라");
    }

    @Test
    @DisplayName("모든 컬럼을 서로 바뀌지 않고 저장함")
    void 모든_컬럼을_서로_바뀌지_않고_저장함() {
        // given
        BuildingRegisterRow row = fullRow(P1, "K1", 1);

        // when
        replace(KEY, List.of(row));

        // then
        assertRegisterColumns(registerOf("K1"), row, parcelId(P1));
    }

    @Test
    @DisplayName("바뀐 값은 키를 뺀 모든 컬럼에 반영함")
    void 바뀐_값은_키를_뺀_모든_컬럼에_반영함() {
        // given
        replace(KEY, List.of(fullRow(P1, "K1", 1), fullRow(P2, "K2", 3)));
        BuildingRegisterRow changed = fullRow(P2, "K1", 2);

        // when
        replace(KEY, List.of(changed, fullRow(P2, "K2", 3)));

        // then
        assertRegisterColumns(registerOf("K1"), changed, parcelId(P2));
        assertThat(count("building_register")).isEqualTo(2);
    }

    @Test
    @DisplayName("이름이 같은 동도 관리 키가 다르면 모두 저장함")
    void 이름이_같은_동도_관리_키가_다르면_모두_저장함() {
        // given
        List<BuildingRegisterRow> rows = List.of(unnamedRow(P1, "K1"), unnamedRow(P1, "K2"));

        // when
        replace(KEY, rows);

        // then
        assertThat(count("building_register")).isEqualTo(2);
    }

    @Test
    @DisplayName("삽입이 실패하면 변경 전체를 취소하고 기존 행을 유지함")
    void 삽입이_실패하면_변경_전체를_취소하고_기존_행을_유지함() {
        // given
        replace(KEY, List.of(row(P1, "A", "가빌라", "다세대주택", 10)));
        // lot_address는 varchar(200)
        BuildingRegisterRow tooLongAddress = rowWithLotAddress(P2, "K3", "다빌라", "다세대주택", 10, "가".repeat(201));
        List<BuildingRegisterRow> rows =
                List.of(row(P2, "K2", "나빌라", "다세대주택"), row(P1, "A", "가빌라", "다세대주택", 99), tooLongAddress);

        // when
        Throwable thrown = catchThrowable(() -> replace(KEY, rows));

        // then
        assertThat(thrown).isInstanceOf(DataAccessException.class);
        assertThat(count("building_parcel")).isEqualTo(1);
        assertThat(count("building_register")).isEqualTo(1);
        assertThat(registerOf("A").get("household_count")).isEqualTo(10);
    }

    @Test
    @DisplayName("저장된 필지가 있는 법정동만 코드 순으로 반환함")
    void 저장된_필지가_있는_법정동만_코드_순으로_반환함() {
        // given
        replace(OTHER_KEY, List.of(row(parcel("10500", "0001"), "K9", null, "다세대주택")));
        replace(KEY, List.of(row(P1, "K1", null, "다세대주택")));
        replace(new LegalDongKey("11350", "10600"), List.of());

        // when
        List<LegalDongKey> keys = service.findStoredLegalDongs();

        // then
        assertThat(keys).containsExactly(KEY, OTHER_KEY);
    }
}
