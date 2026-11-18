package kr.jipsee.building.repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.region.dto.LegalDongKey;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** building_parcel과 building_register 조회와 저장 (JdbcTemplate) */
@Repository
@RequiredArgsConstructor
public class BuildingRegisterRepository {
    private final JdbcTemplate jdbcTemplate;

    /** 법정동에 저장된 필지의 키와 ID 반환 */
    public Map<ParcelKey, Long> findParcelIds(LegalDongKey key) {
        String sql = "select id, sigungu_code, legal_dong_code, land_type_code, main_lot_number, sub_lot_number"
                + " from building_parcel where sigungu_code = ? and legal_dong_code = ?";
        Map<ParcelKey, Long> parcelIds = jdbcTemplate.query(
                sql,
                rs -> {
                    Map<ParcelKey, Long> ids = new HashMap<>();
                    while (rs.next()) {
                        ParcelKey parcelKey = new ParcelKey(
                                rs.getString("sigungu_code"),
                                rs.getString("legal_dong_code"),
                                rs.getString("land_type_code"),
                                rs.getString("main_lot_number"),
                                rs.getString("sub_lot_number"));
                        ids.put(parcelKey, rs.getLong("id"));
                    }
                    return ids;
                },
                key.sigunguCode(),
                key.legalDongCode());

        return Objects.requireNonNull(parcelIds);
    }

    /** 필지를 한 번의 배치로 삽입함. 이름은 null로 둠 */
    public void insertParcels(List<ParcelKey> parcelKeys) {
        String sql = "insert into building_parcel (sigungu_code, legal_dong_code, land_type_code, main_lot_number,"
                + " sub_lot_number) values (?, ?, ?, ?, ?)";
        List<Object[]> args = parcelKeys.stream()
                .map(key -> new Object[] {
                    key.sigunguCode(), key.legalDongCode(), key.landTypeCode(), key.mainLotNumber(), key.subLotNumber()
                })
                .toList();
        jdbcTemplate.batchUpdate(sql, args);
    }

    /** 동을 관리 키 기준으로 삽입하고, 이미 있으면 관리 키를 뺀 모든 컬럼을 갱신함 */
    public void upsertRegisters(List<BuildingRegisterRow> rows, Map<ParcelKey, Long> parcelIds) {
        String sql = "insert into building_register (building_parcel_id, management_register_key, lot_address,"
                + " road_address, name, dong_name, main_annex_type_code, use_approval_date, household_count,"
                + " above_ground_floor_count, underground_floor_count, passenger_elevator_count, structure_name,"
                + " earthquake_design_applied, total_floor_area, etc_purpose, indoor_mechanical_parking_count,"
                + " outdoor_mechanical_parking_count, indoor_self_propelled_parking_count,"
                + " outdoor_self_propelled_parking_count)"
                + " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) as new"
                + " on duplicate key update"
                + " building_parcel_id = new.building_parcel_id,"
                + " lot_address = new.lot_address,"
                + " road_address = new.road_address,"
                + " name = new.name,"
                + " dong_name = new.dong_name,"
                + " main_annex_type_code = new.main_annex_type_code,"
                + " use_approval_date = new.use_approval_date,"
                + " household_count = new.household_count,"
                + " above_ground_floor_count = new.above_ground_floor_count,"
                + " underground_floor_count = new.underground_floor_count,"
                + " passenger_elevator_count = new.passenger_elevator_count,"
                + " structure_name = new.structure_name,"
                + " earthquake_design_applied = new.earthquake_design_applied,"
                + " total_floor_area = new.total_floor_area,"
                + " etc_purpose = new.etc_purpose,"
                + " indoor_mechanical_parking_count = new.indoor_mechanical_parking_count,"
                + " outdoor_mechanical_parking_count = new.outdoor_mechanical_parking_count,"
                + " indoor_self_propelled_parking_count = new.indoor_self_propelled_parking_count,"
                + " outdoor_self_propelled_parking_count = new.outdoor_self_propelled_parking_count";
        List<Object[]> args = rows.stream()
                .map(row -> toArgs(row, parcelIds.get(row.parcelKey())))
                .toList();
        jdbcTemplate.batchUpdate(sql, args);
    }

    private static Object[] toArgs(BuildingRegisterRow row, Long parcelId) {
        return new Object[] {
            parcelId,
            row.managementRegisterKey(),
            row.lotAddress(),
            row.roadAddress(),
            row.name(),
            row.dongName(),
            row.mainAnnexTypeCode(),
            row.useApprovalDate(),
            row.householdCount(),
            row.aboveGroundFloorCount(),
            row.undergroundFloorCount(),
            row.passengerElevatorCount(),
            row.structureName(),
            row.earthquakeDesignApplied(),
            row.totalFloorArea(),
            row.etcPurpose(),
            row.indoorMechanicalParkingCount(),
            row.outdoorMechanicalParkingCount(),
            row.indoorSelfPropelledParkingCount(),
            row.outdoorSelfPropelledParkingCount()
        };
    }

    /** 법정동의 필지에 저장된 동의 관리 키 반환 */
    public Set<String> findRegisterKeys(LegalDongKey key) {
        String sql = "select r.management_register_key from building_register r"
                + " join building_parcel p on p.id = r.building_parcel_id"
                + " where p.sigungu_code = ? and p.legal_dong_code = ?";
        List<String> keys = jdbcTemplate.queryForList(sql, String.class, key.sigunguCode(), key.legalDongCode());

        return new HashSet<>(keys);
    }

    /** 법정동의 필지에 저장된 동의 개수 반환 */
    public int countRegisters(LegalDongKey key) {
        String sql = "select count(*) from building_register r join building_parcel p on p.id = r.building_parcel_id"
                + " where p.sigungu_code = ? and p.legal_dong_code = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, key.sigunguCode(), key.legalDongCode());

        return Objects.requireNonNull(count);
    }

    /** 관리 키에 해당하는 동을 건당 배치로 삭제함 */
    public void deleteRegisters(Collection<String> managementRegisterKeys) {
        String sql = "delete from building_register where management_register_key = ?";
        List<Object[]> args = managementRegisterKeys.stream()
                .map(registerKey -> new Object[] {registerKey})
                .toList();
        jdbcTemplate.batchUpdate(sql, args);
    }

    /** 법정동의 모든 필지 이름을 건물명이 있는 동 중 ID가 가장 작은 동의 건물명으로 다시 정함. 없으면 null */
    public void refreshParcelNames(LegalDongKey key) {
        String sql = "update building_parcel p set p.name = (select r.name from building_register r"
                + " where r.building_parcel_id = p.id and r.name is not null order by r.id limit 1)"
                + " where p.sigungu_code = ? and p.legal_dong_code = ?";
        jdbcTemplate.update(sql, key.sigunguCode(), key.legalDongCode());
    }

    /** 필지가 저장된 법정동을 코드 순으로 반환 */
    public List<LegalDongKey> findLegalDongs() {
        String sql = "select distinct sigungu_code, legal_dong_code from building_parcel"
                + " order by sigungu_code, legal_dong_code";

        return jdbcTemplate.query(
                sql, (rs, rowNum) -> new LegalDongKey(rs.getString("sigungu_code"), rs.getString("legal_dong_code")));
    }
}
