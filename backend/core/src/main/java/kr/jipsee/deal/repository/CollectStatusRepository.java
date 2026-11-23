package kr.jipsee.deal.repository;

import java.time.LocalDateTime;
import java.util.List;
import kr.jipsee.deal.dto.CollectStatusRow;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** collect_status 테이블의 마지막 수집 시각 저장과 조회 */
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

    /** RENT_DEAL, SALE_DEAL 출처의 마지막 수집 시각을 출처 순으로 조회 */
    public List<CollectStatusRow> findAll() {
        String sql = "select source, loaded_at from collect_status"
                + " where source in ('RENT_DEAL', 'SALE_DEAL') order by source";

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) ->
                        new CollectStatusRow(rs.getString("source"), rs.getObject("loaded_at", LocalDateTime.class)));
    }
}
