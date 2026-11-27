package kr.jipsee.deal.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.deal.dto.DealGroupRow;
import kr.jipsee.deal.dto.RegionFilter;
import kr.jipsee.deal.dto.SearchCondition;
import kr.jipsee.region.LegalDong;
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
class DealGroupSearchRepositoryTest {

    private static final LocalDate NOV_1 = LocalDate.of(2026, 11, 1);

    @Autowired
    DealGroupSearchRepository dealGroupSearchRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("delete from deal_group");
    }

    private void insert(
            String sigunguCode, String legalDongName, String lotNumber, String name, LocalDate lastDealDate) {
        jdbcTemplate.update(
                "insert into deal_group (sigungu_code, legal_dong_name, lot_number, name, last_deal_date)"
                        + " values (?, ?, ?, ?, ?)",
                sigunguCode,
                legalDongName,
                lotNumber,
                name,
                lastDealDate);
    }

    private void insert(String lotNumber, String name) {
        insert("11440", "망원동", lotNumber, name, NOV_1);
    }

    /** 2자 이상 이름 단어(FULLTEXT 대상) 조건 */
    private SearchCondition byName(String... words) {
        return new SearchCondition(List.of(), RegionFilter.absent(), List.of(words), List.of(words));
    }

    private SearchCondition byLot(String... words) {
        return new SearchCondition(List.of(words), RegionFilter.sigungu(Set.of("11440")), List.of(), List.of());
    }

    private List<String> lots(SearchCondition condition) {
        return dealGroupSearchRepository.search(condition, 0).stream()
                .map(DealGroupRow::lotNumber)
                .toList();
    }

    @Test
    @DisplayName("지번 단어 5는 5와 5-1만 일치하고 15, 12-5, 산5는 제외함")
    void 지번_단어_5는_5와_5_1만_일치하고_15_12_5_산5는_제외함() {
        // given
        List.of("5", "5-1", "15", "12-5", "산5").forEach(lot -> insert(lot, "빌라"));

        // when
        List<String> result = lots(byLot("5"));

        // then
        assertThat(result).containsExactlyInAnyOrder("5", "5-1");
    }

    @Test
    @DisplayName("산이 있는 지번 단어는 산 지번만 일치함")
    void 산이_있는_지번_단어는_산_지번만_일치함() {
        // given
        List.of("5", "산5", "산15").forEach(lot -> insert(lot, "빌라"));

        // when
        List<String> result = lots(byLot("산5"));

        // then
        assertThat(result).containsExactly("산5");
    }

    @Test
    @DisplayName("FULLTEXT 단어 2개는 모두 포함한 이름만 일치함")
    void FULLTEXT_단어_2개는_모두_포함한_이름만_일치함() {
        // given
        insert("1", "망원 푸른빌라");
        insert("2", "망원 하늘하우스");
        insert("3", "서교 푸른빌라");

        // when
        List<String> result = lots(byName("망원", "푸른빌라"));

        // then
        assertThat(result).containsExactly("1");
    }

    @Test
    @DisplayName("A동은 일치하고 hill은 정다운ville에 일치하지 않음")
    void A동은_일치하고_hill은_정다운ville에_일치하지_않음() {
        // given
        insert("1", "A동 빌라");
        insert("2", "정다운ville");
        insert("3", "래미안 hill");

        // when
        List<String> aDong = lots(byName("A동"));
        List<String> hill = lots(byName("hill"));

        // then
        assertThat(aDong).containsExactly("1");
        assertThat(hill).containsExactly("3");
    }

    @Test
    @DisplayName("FULLTEXT 단어와 1자 단어를 함께 쓰면 모두 포함한 이름만 일치함")
    void FULLTEXT_단어와_1자_단어를_함께_쓰면_모두_포함한_이름만_일치함() {
        // given
        insert("1", "푸른빌라 A");
        insert("2", "푸른빌라 B");
        insert("3", "하늘빌라 A");
        SearchCondition condition =
                new SearchCondition(List.of(), RegionFilter.absent(), List.of("푸른빌라"), List.of("푸른빌라", "A"));

        // when
        List<String> result = lots(condition);

        // then
        assertThat(result).containsExactly("1");
    }

    @Test
    @DisplayName("1자 단어는 지역 조건과 함께 locate로 일치함")
    void 한_자_단어는_지역_조건과_함께_locate로_일치함() {
        // given
        insert("1", "가 빌라");
        insert("2", "나 빌라");
        SearchCondition condition =
                new SearchCondition(List.of(), RegionFilter.sigungu(Set.of("11440")), List.of(), List.of("가"));

        // when
        List<String> result = lots(condition);

        // then
        assertThat(result).containsExactly("1");
    }

    @Test
    @DisplayName("시군구 코드와 법정동 쌍으로 지역을 필터링함")
    void 시군구_코드와_법정동_쌍으로_지역을_필터링함() {
        // given
        insert("11440", "망원동", "1", "가 빌라", NOV_1);
        insert("11440", "서교동", "2", "나 빌라", NOV_1);
        insert("11380", "망원동", "3", "다 빌라", NOV_1);
        SearchCondition sigungu =
                new SearchCondition(List.of(), RegionFilter.sigungu(Set.of("11440")), List.of(), List.of());
        SearchCondition legalDong = new SearchCondition(
                List.of(),
                RegionFilter.legalDong(List.of(new LegalDong("11440", "망원동"), new LegalDong("11380", "망원동"))),
                List.of(),
                List.of());

        // when
        List<String> bySigungu = lots(sigungu);
        List<String> byLegalDong = lots(legalDong);

        // then
        assertThat(bySigungu).containsExactlyInAnyOrder("1", "2");
        assertThat(byLegalDong).containsExactlyInAnyOrder("1", "3");
    }

    @Test
    @DisplayName("최근 계약일 내림차순이고 같은 날은 시군구 코드, 법정동명, 지번 순으로 정렬함")
    void 최근_계약일_내림차순이고_같은_날은_시군구_코드_법정동명_지번_순으로_정렬함() {
        // given
        insert("11440", "서교동", "2", "푸른빌라", LocalDate.of(2026, 10, 1));
        insert("11440", "망원동", "3", "푸른빌라", NOV_1);
        insert("11440", "망원동", "1", "푸른빌라", NOV_1);
        insert("11380", "망원동", "9", "푸른빌라", NOV_1);
        insert("11440", "망원동", "4", "푸른빌라", LocalDate.of(2026, 11, 2));

        // when
        List<String> result = lots(byName("푸른빌라"));

        // then
        assertThat(result).containsExactly("4", "9", "1", "3", "2");
    }

    @Test
    @DisplayName("일치하는 건물이 21개를 넘으면 21행을 반환하고 offset으로 다음 행을 조회함")
    void 일치하는_건물이_21개를_넘으면_21행을_반환하고_offset으로_다음_행을_조회함() {
        // given
        IntStream.rangeClosed(1, 25).forEach(i -> insert(String.format("%02d", i), "푸른빌라"));

        // when
        List<DealGroupRow> first = dealGroupSearchRepository.search(byName("푸른빌라"), 0);
        List<DealGroupRow> last = dealGroupSearchRepository.search(byName("푸른빌라"), 20);

        // then
        assertThat(first).hasSize(21);
        assertThat(last).hasSize(5);
    }

    @Test
    @DisplayName("이름이 null인 건물은 이름 조건이 있으면 제외하고 지역 조건만 있으면 포함함")
    void 이름이_null인_건물은_이름_조건이_있으면_제외하고_지역_조건만_있으면_포함함() {
        // given
        insert("1", null);
        insert("2", "푸른빌라");
        SearchCondition regionOnly =
                new SearchCondition(List.of(), RegionFilter.sigungu(Set.of("11440")), List.of(), List.of());
        SearchCondition withName =
                new SearchCondition(List.of(), RegionFilter.sigungu(Set.of("11440")), List.of("푸른빌라"), List.of("푸른빌라"));

        // when
        List<String> byRegion = lots(regionOnly);
        List<String> byName = lots(withName);

        // then
        assertThat(byRegion).containsExactlyInAnyOrder("1", "2");
        assertThat(byName).containsExactly("2");
    }

    @Test
    @DisplayName("시군구 코드나 법정동 쌍 목록이 비어 있으면 예외를 던짐")
    void 시군구_코드나_법정동_쌍_목록이_비어_있으면_예외를_던짐() {
        // given
        SearchCondition emptyCodes =
                new SearchCondition(List.of(), RegionFilter.sigungu(Set.of()), List.of(), List.of());
        SearchCondition emptyPairs =
                new SearchCondition(List.of(), RegionFilter.legalDong(List.of()), List.of(), List.of());

        // when
        Throwable codesThrown = catchThrowable(() -> dealGroupSearchRepository.search(emptyCodes, 0));
        Throwable pairsThrown = catchThrowable(() -> dealGroupSearchRepository.search(emptyPairs, 0));

        // then
        assertThat(codesThrown).hasRootCauseInstanceOf(IllegalArgumentException.class);
        assertThat(pairsThrown).hasRootCauseInstanceOf(IllegalArgumentException.class);
    }
}
