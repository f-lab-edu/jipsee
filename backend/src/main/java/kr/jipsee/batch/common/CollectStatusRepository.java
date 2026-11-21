package kr.jipsee.batch.common;

import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** collect_status 테이블의 마지막 수집 시각 저장 */
@Repository
@RequiredArgsConstructor
public class CollectStatusRepository {
    private final JdbcTemplate jdbcTemplate;

    /** 출처의 마지막 수집 시각 저장. 행이 없으면 생성하고, 있으면 loaded_at만 변경 */
    public void saveLoadedAt(String source, LocalDateTime loadedAt) {
        String sql = "insert into collect_status (source, loaded_at) values (?, ?) as new"
                + " on duplicate key update loaded_at = new.loaded_at";
        jdbcTemplate.update(sql, source, loadedAt);
    }

    /** 출처의 행이 있는지 반환 */
    public boolean exists(String source) {
        Boolean exists = jdbcTemplate.queryForObject(
                "select exists(select 1 from collect_status where source = ?)", Boolean.class, source);

        return Boolean.TRUE.equals(exists);
    }

    /** 출처의 마지막 수집 시각 반환. 행이 없으면 빈 값 */
    public Optional<LocalDateTime> findLoadedAt(String source) {
        return jdbcTemplate
                .query(
                        "select loaded_at from collect_status where source = ?",
                        (rs, rowNum) -> rs.getTimestamp("loaded_at").toLocalDateTime(),
                        source)
                .stream()
                .findFirst();
    }
}
