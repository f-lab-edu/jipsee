package kr.jipsee.building.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.building.dto.ParcelYears;
import kr.jipsee.region.dto.LegalDongKey;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class BuildingParcelServiceTest {

    private static final LegalDongKey LEGAL_DONG = new LegalDongKey("11350", "10400");
    private static final ParcelKey KEY = new ParcelKey("11350", "10400", "0", "0130", "0069");
    private static final LocalDateTime LOOKED_UP_AT = LocalDateTime.of(2026, 11, 15, 9, 0);

    @Autowired
    BuildingParcelService service;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    PlatformTransactionManager transactionManager;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from sale_deal");
        jdbcTemplate.update("delete from rent_deal");
        jdbcTemplate.update("delete from building_register");
        jdbcTemplate.update("delete from building_parcel_lookup");
        jdbcTemplate.update("delete from building_parcel");
    }

    private long insertParcel(ParcelKey key) {
        jdbcTemplate.update(
                "insert into building_parcel (sigungu_code, legal_dong_code, land_type_code, main_lot_number,"
                        + " sub_lot_number) values (?, ?, ?, ?, ?)",
                key.sigunguCode(),
                key.legalDongCode(),
                key.landTypeCode(),
                key.mainLotNumber(),
                key.subLotNumber());

        return parcelId(key);
    }

    private long parcelId(ParcelKey key) {
        Long id = jdbcTemplate.queryForObject(
                "select id from building_parcel where sigungu_code = ? and legal_dong_code = ? and land_type_code = ?"
                        + " and main_lot_number = ? and sub_lot_number = ?",
                Long.class,
                key.sigunguCode(),
                key.legalDongCode(),
                key.landTypeCode(),
                key.mainLotNumber(),
                key.subLotNumber());

        return id;
    }

    private void insertRegister(long parcelId, String managementKey, String useApprovalDate) {
        jdbcTemplate.update(
                "insert into building_register (building_parcel_id, management_register_key, lot_address,"
                        + " main_annex_type_code, use_approval_date) values (?, ?, '서울특별시 노원구 하계동 130-69', '0', ?)",
                parcelId,
                managementKey,
                useApprovalDate);
    }

    private static BuildingRegisterRow row(
            String managementKey, String name, String etcPurpose, String useApprovalDate) {
        return new BuildingRegisterRow(
                KEY,
                managementKey,
                "서울특별시 노원구 하계동 130-69",
                null,
                name,
                "A동",
                "0",
                useApprovalDate,
                8,
                4,
                0,
                0,
                "철근콘크리트구조",
                "0",
                new BigDecimal("100.0000"),
                etcPurpose,
                0,
                0,
                0,
                0);
    }

    private long insertFailedDeal() {
        jdbcTemplate.update("insert into rent_deal (sigungu_code, legal_dong_name, lot_number, exclusive_area,"
                + " deal_date, deposit, monthly_rent, match_status)"
                + " values ('11350', '하계동', '130-69', 59.99, '2026-10-01', 10000, 0, 'FAILED')");

        Long id = jdbcTemplate.queryForObject("select id from rent_deal", Long.class);

        return id;
    }

    private long countRows(String table) {
        Long count = jdbcTemplate.queryForObject("select count(*) from " + table, Long.class);

        return count;
    }

    private Map<String, Object> lookupRow() {
        return jdbcTemplate.queryForMap("select result, looked_up_at from building_parcel_lookup");
    }

    @Test
    @DisplayName("동이 있는 필지는 동 행 유무와 사용승인 연도 집합을 반환함")
    void 동이_있는_필지는_동_행_유무와_사용승인_연도_집합을_반환함() {
        // given
        long parcelId = insertParcel(KEY);
        insertRegister(parcelId, "K1", "20040312");
        insertRegister(parcelId, "K2", "19950101");
        insertRegister(parcelId, "K3", null);

        // when
        Map<ParcelKey, ParcelYears> parcels = service.findParcelYears(LEGAL_DONG);

        // then
        assertThat(parcels).containsOnly(Map.entry(KEY, new ParcelYears(parcelId, true, Set.of(2004, 1995))));
    }

    @Test
    @DisplayName("동 행이 없는 필지는 hasRegisters가 false이고 연도가 비어 있음")
    void 동_행이_없는_필지는_hasRegisters가_false이고_연도가_비어_있음() {
        // given
        long parcelId = insertParcel(KEY);

        // when
        Map<ParcelKey, ParcelYears> parcels = service.findParcelYears(LEGAL_DONG);

        // then
        assertThat(parcels).containsOnly(Map.entry(KEY, new ParcelYears(parcelId, false, Set.of())));
    }

    @Test
    @DisplayName("사용승인일이 모두 null인 필지는 hasRegisters가 true이고 연도가 비어 있음")
    void 사용승인일이_모두_null인_필지는_hasRegisters가_true이고_연도가_비어_있음() {
        // given
        long parcelId = insertParcel(KEY);
        insertRegister(parcelId, "K1", null);
        insertRegister(parcelId, "K2", null);

        // when
        Map<ParcelKey, ParcelYears> parcels = service.findParcelYears(LEGAL_DONG);

        // then
        assertThat(parcels).containsOnly(Map.entry(KEY, new ParcelYears(parcelId, true, Set.of())));
    }

    @Test
    @DisplayName("다른 법정동의 필지는 반환하지 않음")
    void 다른_법정동의_필지는_반환하지_않음() {
        // given
        insertParcel(new ParcelKey("11350", "10500", "0", "0130", "0069"));

        // when
        Map<ParcelKey, ParcelYears> parcels = service.findParcelYears(LEGAL_DONG);

        // then
        assertThat(parcels).isEmpty();
    }

    @Test
    @DisplayName("대상 필지의 단건 조회 결과는 필지와 모든 동을 저장하고 ParcelYears를 반환함")
    void 대상_필지의_단건_조회_결과는_필지와_모든_동을_저장하고_ParcelYears를_반환함() {
        // given
        List<BuildingRegisterRow> rows = List.of(
                row("K1", null, "다세대주택", "20040312"),
                row("K2", null, null, null),
                row("K3", null, "근린생활시설", "19950101"));

        // when
        Optional<ParcelYears> stored = service.storeLookedUp(KEY, rows, LOOKED_UP_AT);

        // then
        assertThat(stored).contains(new ParcelYears(parcelId(KEY), true, Set.of(2004, 1995)));
        assertThat(countRows("building_parcel")).isEqualTo(1);
        assertThat(countRows("building_register")).isEqualTo(3);
        assertThat(lookupRow()).containsEntry("result", "SAVED");
        assertThat(lookupRow()).containsEntry("looked_up_at", LOOKED_UP_AT);
    }

    @Test
    @DisplayName("응답이 0행이면 기록만 남기고 빈 값을 반환함")
    void 응답이_0행이면_기록만_남기고_빈_값을_반환함() {
        // when
        Optional<ParcelYears> stored = service.storeLookedUp(KEY, List.of(), LOOKED_UP_AT);

        // then
        assertThat(stored).isEmpty();
        assertThat(countRows("building_parcel")).isZero();
        assertThat(lookupRow()).containsEntry("result", "EMPTY");
    }

    @Test
    @DisplayName("대상이 아니면 기록만 남기고 빈 값을 반환함")
    void 대상이_아니면_기록만_남기고_빈_값을_반환함() {
        // when
        Optional<ParcelYears> stored =
                service.storeLookedUp(KEY, List.of(row("K1", null, "단독주택", "20040312")), LOOKED_UP_AT);

        // then
        assertThat(stored).isEmpty();
        assertThat(countRows("building_parcel")).isZero();
        assertThat(countRows("building_register")).isZero();
        assertThat(lookupRow()).containsEntry("result", "EXCLUDED");
    }

    @Test
    @DisplayName("같은 필지를 다시 조회하면 기록 한 행의 시각과 결과를 갱신함")
    void 같은_필지를_다시_조회하면_기록_한_행의_시각과_결과를_갱신함() {
        // given
        LocalDateTime later = LOOKED_UP_AT.plusDays(30);
        service.storeLookedUp(KEY, List.of(), LOOKED_UP_AT);

        // when
        service.storeLookedUp(KEY, List.of(row("K1", null, "다세대주택", "20040312")), later);

        // then
        assertThat(countRows("building_parcel_lookup")).isEqualTo(1);
        assertThat(lookupRow()).containsEntry("result", "SAVED");
        assertThat(service.findLookedUpAt(KEY)).contains(later);
    }

    @Test
    @DisplayName("필지 name은 건물명이 있는 동 중 id가 가장 작은 동의 건물명임")
    void 필지_name은_건물명이_있는_동_중_id가_가장_작은_동의_건물명임() {
        // given
        List<BuildingRegisterRow> rows = List.of(
                row("K1", null, "다세대주택", "20040312"),
                row("K2", "가빌라", "다세대주택", "20040312"),
                row("K3", "나빌라", "다세대주택", "20040312"));

        // when
        service.storeLookedUp(KEY, rows, LOOKED_UP_AT);

        // then
        String name = jdbcTemplate.queryForObject("select name from building_parcel", String.class);
        assertThat(name).isEqualTo("가빌라");
    }

    @Test
    @DisplayName("저장은 바깥 트랜잭션과 따로 커밋됨")
    void 저장은_바깥_트랜잭션과_따로_커밋됨() {
        // given
        TransactionTemplate outer = new TransactionTemplate(transactionManager);

        // when
        outer.executeWithoutResult(status -> {
            service.storeLookedUp(KEY, List.of(row("K1", null, "다세대주택", "20040312")), LOOKED_UP_AT);
            status.setRollbackOnly();
        });

        // then
        assertThat(countRows("building_parcel")).isEqualTo(1);
        assertThat(countRows("building_parcel_lookup")).isEqualTo(1);
    }

    @Test
    @DisplayName("바깥 트랜잭션이 읽기를 마친 뒤 저장해도 반환한 필지 ID로 바깥에서 거래를 갱신할 수 있음")
    void 바깥_트랜잭션이_읽기를_마친_뒤_저장해도_반환한_필지_ID로_바깥에서_거래를_갱신할_수_있음() {
        // given
        long dealId = insertFailedDeal();
        TransactionTemplate outer = new TransactionTemplate(transactionManager);
        AtomicLong storedParcelId = new AtomicLong();

        // when
        outer.executeWithoutResult(status -> {
            assertThat(service.findParcelYears(LEGAL_DONG)).isEmpty();

            ParcelYears stored = service.storeLookedUp(KEY, List.of(row("K1", null, "다세대주택", "20040312")), LOOKED_UP_AT)
                    .orElseThrow();
            storedParcelId.set(stored.parcelId());

            assertThat(service.findParcelYears(LEGAL_DONG)).isEmpty();
            jdbcTemplate.update(
                    "update rent_deal set building_parcel_id = ?, match_status = 'CONFIRMED' where id = ?",
                    stored.parcelId(),
                    dealId);
        });

        // then
        Long parcelId = jdbcTemplate.queryForObject(
                "select building_parcel_id from rent_deal where id = ?", Long.class, dealId);
        assertThat(parcelId).isEqualTo(storedParcelId.get());
    }
}
