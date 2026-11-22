package kr.jipsee.deal.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import kr.jipsee.TestcontainersConfiguration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class CollectStatusRepositoryTest {

    @Autowired
    CollectStatusRepository collectStatusRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from collect_status");
    }

    @Test
    @DisplayName("행이 없으면 만들고 있으면 loaded_at만 바꿈")
    void 행이_없으면_만들고_있으면_loaded_at만_바꿈() {
        // given
        collectStatusRepository.saveLoadedAt("RENT_DEAL", LocalDateTime.of(2026, 11, 4, 4, 0));

        // when
        collectStatusRepository.saveLoadedAt("RENT_DEAL", LocalDateTime.of(2026, 11, 5, 4, 0));

        // then
        assertThat(jdbcTemplate.queryForObject("select count(*) from collect_status", Integer.class))
                .isEqualTo(1);
        assertThat(jdbcTemplate.queryForObject(
                        "select loaded_at from collect_status where source = 'RENT_DEAL'", LocalDateTime.class))
                .isEqualTo(LocalDateTime.of(2026, 11, 5, 4, 0));
    }

    @Test
    @DisplayName("data_source 테이블은 없고 collect_status 테이블이 있음")
    void data_source_테이블은_없고_collect_status_테이블이_있음() {
        // given
        String sql = "select count(*) from information_schema.tables"
                + " where table_schema = database() and table_name = ?";

        // when
        Integer dataSource = jdbcTemplate.queryForObject(sql, Integer.class, "data_source");
        Integer collectStatus = jdbcTemplate.queryForObject(sql, Integer.class, "collect_status");

        // then
        assertThat(dataSource).isZero();
        assertThat(collectStatus).isEqualTo(1);
    }
}
