package kr.jipsee.deal.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.deal.dto.HouseNames;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class DealGroupRefreshRepositoryTest {

    private static final String SIGUNGU = "11440";
    private static final String DONG = "망원동";

    private long nextId = 1;

    @Autowired
    DealGroupRefreshRepository dealGroupRefreshRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from rent_deal");
        jdbcTemplate.update("delete from sale_deal");
        jdbcTemplate.update("delete from deal_group");
    }

    private void insertRent(
            String lotNumber, String houseName, LocalDate dealDate, int monthlyRent, String contractType, Long id) {
        jdbcTemplate.update(
                "insert into rent_deal (id, sigungu_code, legal_dong_name, lot_number, house_name, exclusive_area,"
                        + " deal_date, deposit, monthly_rent, contract_type)"
                        + " values (?, ?, ?, ?, ?, 59.99, ?, 30000, ?, ?)",
                id,
                SIGUNGU,
                DONG,
                lotNumber,
                houseName,
                dealDate,
                monthlyRent,
                contractType);
    }

    private void insertRent(String lotNumber, String houseName, LocalDate dealDate) {
        insertRent(lotNumber, houseName, dealDate, 0, null, nextId++);
    }

    private void insertSale(String lotNumber, String houseName, LocalDate dealDate, Long id) {
        jdbcTemplate.update(
                "insert into sale_deal (id, sigungu_code, legal_dong_name, lot_number, house_name, exclusive_area,"
                        + " deal_date, deal_amount) values (?, ?, ?, ?, ?, 84.50, ?, 90000)",
                id,
                SIGUNGU,
                DONG,
                lotNumber,
                houseName,
                dealDate);
    }

    private void insertSale(String lotNumber, String houseName, LocalDate dealDate) {
        insertSale(lotNumber, houseName, dealDate, nextId++);
    }

    private String name(String lotNumber) {
        return jdbcTemplate.queryForObject("select name from deal_group where lot_number = ?", String.class, lotNumber);
    }

    private LocalDate date(String column, String lotNumber) {
        return jdbcTemplate.queryForObject(
                "select " + column + " from deal_group where lot_number = ?", LocalDate.class, lotNumber);
    }

    private int count(String table) {
        return jdbcTemplate.queryForObject("select count(*) from " + table, Integer.class);
    }

    private boolean tableExists(String table) {
        return jdbcTemplate.queryForObject(
                        "select count(*) from information_schema.tables where table_schema = database() and table_name = ?",
                        Integer.class,
                        table)
                == 1;
    }

    @Test
    @DisplayName("전월세와 매매의 같은 키는 1행이고 lot_number가 null인 거래는 제외함")
    void 전월세와_매매의_같은_키는_1행이고_lot_number가_null인_거래는_제외함() {
        // given
        insertRent("1", "가 빌라", LocalDate.of(2026, 1, 1));
        insertSale("1", "가 빌라", LocalDate.of(2026, 2, 1));
        insertRent(null, "나 빌라", LocalDate.of(2026, 3, 1), 0, null, nextId++);

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(count("deal_group")).isEqualTo(1);
    }

    @Test
    @DisplayName("last_deal_date는 전월세와 매매 전체의 최댓값임")
    void last_deal_date는_전월세와_매매_전체의_최댓값임() {
        // given
        insertRent("1", "가 빌라", LocalDate.of(2026, 1, 1));
        insertSale("1", "가 빌라", LocalDate.of(2026, 5, 1));
        insertRent("1", "가 빌라", LocalDate.of(2026, 3, 1));

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(date("last_deal_date", "1")).isEqualTo(LocalDate.of(2026, 5, 1));
    }

    @Test
    @DisplayName("latest_new_jeonse_date는 월세가 0이고 계약 구분이 신규인 거래의 최댓값이고 없으면 null임")
    void latest_new_jeonse_date는_월세가_0이고_계약_구분이_신규인_거래의_최댓값이고_없으면_null임() {
        // given
        insertRent("1", "가 빌라", LocalDate.of(2026, 1, 1), 0, "신규", nextId++);
        insertRent("1", "가 빌라", LocalDate.of(2026, 2, 1), 0, "신규", nextId++);
        insertRent("1", "가 빌라", LocalDate.of(2026, 3, 1), 0, "갱신", nextId++);
        insertRent("1", "가 빌라", LocalDate.of(2026, 4, 1), 50, "신규", nextId++);
        insertSale("1", "가 빌라", LocalDate.of(2026, 5, 1));
        insertRent("2", "나 빌라", LocalDate.of(2026, 1, 1), 0, "갱신", nextId++);
        insertSale("3", "다 빌라", LocalDate.of(2026, 1, 1));

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(date("latest_new_jeonse_date", "1")).isEqualTo(LocalDate.of(2026, 2, 1));
        assertThat(date("latest_new_jeonse_date", "2")).isNull();
        assertThat(date("latest_new_jeonse_date", "3")).isNull();
    }

    @Test
    @DisplayName("name은 가장 늦은 계약일의 글자 포함 이름이고 같은 날은 전월세가 우선함")
    void name은_가장_늦은_계약일의_글자_포함_이름이고_같은_날은_전월세가_우선함() {
        // given
        insertRent("1", "옛 빌라", LocalDate.of(2026, 1, 1));
        insertRent("1", "새 빌라", LocalDate.of(2026, 3, 1));
        insertSale("2", "매매 빌라", LocalDate.of(2026, 3, 1));
        insertRent("2", "전월세 빌라", LocalDate.of(2026, 3, 1));

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(name("1")).isEqualTo("새 빌라");
        assertThat(name("2")).isEqualTo("전월세 빌라");
    }

    @Test
    @DisplayName("name은 같은 날 매매의 id가 더 커도 전월세의 이름임")
    void name은_같은_날_매매의_id가_더_커도_전월세의_이름임() {
        // given
        insertRent("1", "전월세 빌라", LocalDate.of(2026, 3, 1), 0, null, 10L);
        insertSale("1", "매매 빌라", LocalDate.of(2026, 3, 1), 20L);

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(name("1")).isEqualTo("전월세 빌라");
    }

    @Test
    @DisplayName("name은 같은 날 같은 출처이면 큰 id의 이름임")
    void name은_같은_날_같은_출처이면_큰_id의_이름임() {
        // given
        insertRent("1", "작은 id 빌라", LocalDate.of(2026, 3, 1), 0, null, 10L);
        insertRent("1", "큰 id 빌라", LocalDate.of(2026, 3, 1), 0, null, 20L);

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(name("1")).isEqualTo("큰 id 빌라");
    }

    @Test
    @DisplayName("name은 가장 늦은 거래가 자리표시이면 이전 이름이고 전부 자리표시이면 null임")
    void name은_가장_늦은_거래가_자리표시이면_이전_이름이고_전부_자리표시이면_null임() {
        // given
        insertRent("1", "이전 빌라", LocalDate.of(2026, 1, 1));
        insertRent("1", "373-3", LocalDate.of(2026, 3, 1));
        insertRent("2", "373-3", LocalDate.of(2026, 3, 1));
        insertRent("3", null, LocalDate.of(2026, 3, 1));

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(name("1")).isEqualTo("이전 빌라");
        assertThat(name("2")).isNull();
        assertThat(name("3")).isNull();
    }

    @ParameterizedTest
    @ValueSource(strings = {"(254-301)", "373-3", "", " ", "ㅋㅋ", "é", "ＡＢ", "101동", "k"})
    @DisplayName("글자 포함 판정이 HouseNames.normalize와 같음")
    void 글자_포함_판정이_HouseNames_normalize와_같음(String houseName) {
        // given
        insertRent("1", houseName, LocalDate.of(2026, 1, 1));

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(name("1")).isEqualTo(HouseNames.normalize(houseName));
    }

    @Test
    @DisplayName("다시 실행하면 사라진 거래의 건물을 제거하고 deal_group_new와 deal_group_old를 남기지 않음")
    void 다시_실행하면_사라진_거래의_건물을_제거하고_deal_group_new와_deal_group_old를_남기지_않음() {
        // given
        insertRent("1", "가 빌라", LocalDate.of(2026, 1, 1));
        insertRent("2", "나 빌라", LocalDate.of(2026, 1, 1));
        dealGroupRefreshRepository.rebuild();
        jdbcTemplate.update("delete from rent_deal where lot_number = '2'");

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(jdbcTemplate.queryForList("select lot_number from deal_group", String.class))
                .containsExactly("1");
        assertThat(tableExists("deal_group_new")).isFalse();
        assertThat(tableExists("deal_group_old")).isFalse();
    }

    @Test
    @DisplayName("이전 실패로 남은 deal_group_new와 deal_group_old가 있어도 다시 실행하면 성공함")
    void 이전_실패로_남은_deal_group_new와_deal_group_old가_있어도_다시_실행하면_성공함() {
        // given
        insertRent("1", "가 빌라", LocalDate.of(2026, 1, 1));
        jdbcTemplate.execute("create table deal_group_new like deal_group");
        jdbcTemplate.execute("create table deal_group_old like deal_group");

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(count("deal_group")).isEqualTo(1);
        assertThat(tableExists("deal_group_new")).isFalse();
        assertThat(tableExists("deal_group_old")).isFalse();
    }

    @Test
    @DisplayName("교체한 deal_group에서 A동과 in FULLTEXT 검색이 일치함")
    void 교체한_deal_group에서_A동과_in_FULLTEXT_검색이_일치함() {
        // given
        insertRent("1", "A동 빌라", LocalDate.of(2026, 1, 1));
        insertRent("2", "in 빌라", LocalDate.of(2026, 1, 1));
        insertRent("3", "푸른 빌라", LocalDate.of(2026, 1, 1));

        // when
        dealGroupRefreshRepository.rebuild();

        // then
        assertThat(search("+\"A동\"")).containsExactly("A동 빌라");
        assertThat(search("+\"in\"")).containsExactly("in 빌라");
    }

    private List<String> search(String booleanQuery) {
        return jdbcTemplate.queryForList(
                "select name from deal_group where match(name) against(? in boolean mode)", String.class, booleanQuery);
    }
}
