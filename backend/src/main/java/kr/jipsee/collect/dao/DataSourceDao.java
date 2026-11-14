package kr.jipsee.collect.dao;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** data_source 테이블의 마지막 수집 시각 저장 */
@Repository
@RequiredArgsConstructor
public class DataSourceDao {
    private final JdbcTemplate jdbcTemplate;

    /** 출처의 마지막 수집 시각 저장. 행이 없으면 생성하고, 있으면 loaded_at만 변경 */
    public void saveLoadedAt(String source, LocalDateTime loadedAt) {
        String sql = "insert into data_source (source, loaded_at) values (?, ?) as new"
                + " on duplicate key update loaded_at = new.loaded_at";
        jdbcTemplate.update(sql, source, loadedAt);
    }
}
