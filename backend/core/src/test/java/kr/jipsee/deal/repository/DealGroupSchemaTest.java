package kr.jipsee.deal.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
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
class DealGroupSchemaTest {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from deal_group");
    }

    @Test
    @DisplayName("불용어가 꺼진 FULLTEXT 인덱스라서 A동과 in 검색이 일치함")
    void 불용어가_꺼진_FULLTEXT_인덱스라서_A동과_in_검색이_일치함() {
        // given
        insert("11440", "망원동", "1", "A동 빌라");
        insert("11440", "망원동", "2", "in 빌라");
        insert("11440", "망원동", "3", "푸른 빌라");

        // when
        List<String> aDong = search("+\"A동\"");
        List<String> in = search("+\"in\"");

        // then
        assertThat(aDong).containsExactly("A동 빌라");
        assertThat(in).containsExactly("in 빌라");
    }

    private void insert(String sigunguCode, String legalDongName, String lotNumber, String name) {
        jdbcTemplate.update(
                "insert into deal_group (sigungu_code, legal_dong_name, lot_number, name, last_deal_date)"
                        + " values (?, ?, ?, ?, '2026-11-01')",
                sigunguCode,
                legalDongName,
                lotNumber,
                name);
    }

    private List<String> search(String booleanQuery) {
        return jdbcTemplate.queryForList(
                "select name from deal_group where match(name) against(? in boolean mode)", String.class, booleanQuery);
    }
}
