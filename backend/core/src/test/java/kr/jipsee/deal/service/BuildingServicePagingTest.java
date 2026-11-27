package kr.jipsee.deal.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.NearbyDeals;
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
class BuildingServicePagingTest {

    private static final BuildingKey KEY = new BuildingKey("11440", "망원동", "519");

    @Autowired
    BuildingService buildingService;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from rent_deal");
        jdbcTemplate.update("delete from sale_deal");
        jdbcTemplate.update("delete from collect_status");
    }

    private void insertRent(long id, String lotNumber) {
        jdbcTemplate.update(
                "insert into rent_deal (id, sigungu_code, legal_dong_name, lot_number, exclusive_area, deal_date,"
                        + " deposit, monthly_rent) values (?, '11440', '망원동', ?, 59.99, ?, 30000, 0)",
                id,
                lotNumber,
                LocalDate.of(2026, 9, 15));
    }

    @Test
    @DisplayName("같은 법정동 전세 45행을 20건씩 나누어 조회함")
    void 같은_법정동_전세_45행을_20건씩_나누어_조회함() {
        // given
        jdbcTemplate.update(
                "insert into collect_status (source, loaded_at) values ('RENT_DEAL', ?)",
                LocalDateTime.of(2026, 11, 19, 4, 2));
        for (long id = 1; id <= 5; id++) {
            insertRent(id, "519");
        }
        for (long id = 6; id <= 45; id++) {
            insertRent(id, String.valueOf(600 + id));
        }

        // when
        NearbyDeals page0 = buildingService.findNearbyDeals(KEY, 12, true, 0);
        NearbyDeals page2 = buildingService.findNearbyDeals(KEY, 12, true, 2);
        NearbyDeals page3 = buildingService.findNearbyDeals(KEY, 12, true, 3);

        // then
        assertThat(page0.deals()).hasSize(20);
        assertThat(page0.hasNext()).isTrue();
        assertThat(page0.totalCount()).isEqualTo(45);
        assertThat(page2.deals()).hasSize(5);
        assertThat(page2.hasNext()).isFalse();
        assertThat(page3.deals()).isEmpty();
        assertThat(page3.hasNext()).isFalse();
        assertThat(page3.totalCount()).isEqualTo(45);
    }
}
