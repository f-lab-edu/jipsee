package kr.jipsee.deal.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.deal.dto.CollectStatusRow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
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

    private void insert(String source, LocalDateTime loadedAt) {
        jdbcTemplate.update("insert into collect_status (source, loaded_at) values (?, ?)", source, loadedAt);
    }

    @Nested
    @DisplayName("findAll")
    class FindAll {

        @Test
        @DisplayName("SALE_DEAL을 먼저 저장해도 RENT_DEAL, SALE_DEAL 순서로 조회함")
        void SALE_DEAL을_먼저_저장해도_RENT_DEAL_SALE_DEAL_순서로_조회함() {
            // given
            insert("SALE_DEAL", LocalDateTime.of(2026, 11, 19, 4, 4));
            insert("RENT_DEAL", LocalDateTime.of(2026, 11, 19, 4, 2));

            // when
            List<CollectStatusRow> rows = collectStatusRepository.findAll();

            // then
            assertThat(rows).extracting(CollectStatusRow::source).containsExactly("RENT_DEAL", "SALE_DEAL");
        }

        @Test
        @DisplayName("RENT_DEAL, SALE_DEAL이 아닌 출처는 제외함")
        void RENT_DEAL_SALE_DEAL이_아닌_출처는_제외함() {
            // given
            insert("RENT_DEAL", LocalDateTime.of(2026, 11, 19, 4, 2));
            insert("BUILDING_REGISTER", LocalDateTime.of(2026, 11, 19, 4, 3));

            // when
            List<CollectStatusRow> rows = collectStatusRepository.findAll();

            // then
            assertThat(rows).extracting(CollectStatusRow::source).containsExactly("RENT_DEAL");
        }

        @Test
        @DisplayName("저장한 loaded_at을 그대로 조회함")
        void 저장한_loaded_at을_그대로_조회함() {
            // given
            LocalDateTime loadedAt = LocalDateTime.of(2026, 11, 19, 4, 2, 26);
            insert("RENT_DEAL", loadedAt);

            // when
            List<CollectStatusRow> rows = collectStatusRepository.findAll();

            // then
            assertThat(rows)
                    .singleElement()
                    .satisfies(row -> assertThat(row.loadedAt()).isEqualTo(loadedAt));
        }

        @Test
        @DisplayName("행이 없으면 빈 목록을 반환함")
        void 행이_없으면_빈_목록을_반환함() {
            // when
            List<CollectStatusRow> rows = collectStatusRepository.findAll();

            // then
            assertThat(rows).isEmpty();
        }
    }
}
