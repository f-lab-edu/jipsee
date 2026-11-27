package kr.jipsee.deal.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import kr.jipsee.TestcontainersConfiguration;
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
class DealIndexSchemaTest {

    @Autowired
    JdbcTemplate jdbcTemplate;

    private List<String> indexes(String table) {
        return jdbcTemplate.queryForList(
                "select distinct index_name from information_schema.statistics"
                        + " where table_schema = database() and table_name = ?",
                String.class,
                table);
    }

    @Test
    @DisplayName("거래 테이블의 house_name FULLTEXT 인덱스는 없고 건물 키 복합 인덱스는 유지함")
    void 거래_테이블의_house_name_FULLTEXT_인덱스는_없고_건물_키_복합_인덱스는_유지함() {
        // when
        List<String> rentIndexes = indexes("rent_deal");
        List<String> saleIndexes = indexes("sale_deal");

        // then
        assertThat(rentIndexes)
                .doesNotContain("ftx_rent_deal_house_name")
                .contains("idx_rent_deal_sigungu_code_legal_dong_name_lot_number_deal_date");
        assertThat(saleIndexes)
                .doesNotContain("ftx_sale_deal_house_name")
                .contains("idx_sale_deal_sigungu_code_legal_dong_name_lot_number_deal_date");
    }
}
