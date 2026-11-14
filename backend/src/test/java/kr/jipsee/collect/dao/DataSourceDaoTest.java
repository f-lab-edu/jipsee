package kr.jipsee.collect.dao;

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
class DataSourceDaoTest {

    @Autowired
    DataSourceDao dataSourceDao;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from data_source");
    }

    @Test
    @DisplayName("행이 없으면 만들고 있으면 loaded_at만 바꿈")
    void 행이_없으면_만들고_있으면_loaded_at만_바꿈() {
        // given
        dataSourceDao.saveLoadedAt("RENT_DEAL", LocalDateTime.of(2026, 11, 4, 4, 0));

        // when
        dataSourceDao.saveLoadedAt("RENT_DEAL", LocalDateTime.of(2026, 11, 5, 4, 0));

        // then
        assertThat(jdbcTemplate.queryForObject("select count(*) from data_source", Integer.class))
                .isEqualTo(1);
        assertThat(jdbcTemplate.queryForObject(
                        "select loaded_at from data_source where source = 'RENT_DEAL'", LocalDateTime.class))
                .isEqualTo(LocalDateTime.of(2026, 11, 5, 4, 0));
    }
}
