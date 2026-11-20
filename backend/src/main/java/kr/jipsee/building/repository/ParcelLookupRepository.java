package kr.jipsee.building.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import kr.jipsee.building.dto.LookupResult;
import kr.jipsee.building.dto.ParcelKey;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** 필지 조회 기록의 읽기와 upsert */
@Repository
@RequiredArgsConstructor
public class ParcelLookupRepository {
    private final JdbcTemplate jdbcTemplate;

    /** 필지의 마지막 조회 시각 반환. 기록이 없으면 빈 값 반환*/
    public Optional<LocalDateTime> findLookedUpAt(ParcelKey key) {
        String sql =
                "select looked_up_at from building_parcel_lookup where sigungu_code = ? and legal_dong_code = ? and land_type_code = ? and main_lot_number = ? and sub_lot_number = ?";

        return jdbcTemplate
                .query(
                        sql,
                        (rs, rowNum) -> rs.getTimestamp("looked_up_at").toLocalDateTime(),
                        key.sigunguCode(),
                        key.legalDongCode(),
                        key.landTypeCode(),
                        key.mainLotNumber(),
                        key.subLotNumber())
                .stream()
                .findFirst();
    }

    /** 조회 기록을 남기고, 이미 있으면 그 시각과 결과를 갱신함 */
    public void upsertLookup(ParcelKey key, LocalDateTime lookedUpAt, LookupResult result) {
        String sql =
                "insert into building_parcel_lookup (sigungu_code, legal_dong_code, land_type_code, main_lot_number, sub_lot_number, looked_up_at, result) values (?, ?, ?, ?, ?, ?, ?) as new on duplicate key update looked_up_at = new.looked_up_at, result = new.result";
        jdbcTemplate.update(
                sql,
                key.sigunguCode(),
                key.legalDongCode(),
                key.landTypeCode(),
                key.mainLotNumber(),
                key.subLotNumber(),
                lookedUpAt,
                result.name());
    }
}
