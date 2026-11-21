package kr.jipsee.batch.common;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.Optional;
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

    @Test
    @DisplayName("출처 행이 있으면 true이고 없으면 false임")
    void 출처_행이_있으면_true이고_없으면_false임() {
        // given
        boolean before = collectStatusRepository.exists("BUILDING_REGISTER");

        // when
        collectStatusRepository.saveLoadedAt("BUILDING_REGISTER", LocalDateTime.of(2026, 11, 4, 4, 0));
        boolean after = collectStatusRepository.exists("BUILDING_REGISTER");

        // then
        assertThat(before).isFalse();
        assertThat(after).isTrue();
    }

    @Test
    @DisplayName("출처의 마지막 수집 시각을 반환하고 행이 없으면 빈 값을 반환함")
    void 출처의_마지막_수집_시각을_반환하고_행이_없으면_빈_값을_반환함() {
        // given
        Optional<LocalDateTime> before = collectStatusRepository.findLoadedAt("BUILDING_REGISTER");

        // when
        collectStatusRepository.saveLoadedAt("BUILDING_REGISTER", LocalDateTime.of(2026, 11, 5, 5, 0));
        Optional<LocalDateTime> after = collectStatusRepository.findLoadedAt("BUILDING_REGISTER");

        // then
        assertThat(before).isEmpty();
        assertThat(after).contains(LocalDateTime.of(2026, 11, 5, 5, 0));
    }
}
