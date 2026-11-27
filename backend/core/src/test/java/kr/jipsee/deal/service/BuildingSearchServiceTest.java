package kr.jipsee.deal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.CollectSource;
import kr.jipsee.deal.dto.DataSourceStatus;
import kr.jipsee.deal.dto.DealGroupRow;
import kr.jipsee.deal.dto.DealGroupSearchPage;
import kr.jipsee.deal.dto.RegionFilter;
import kr.jipsee.deal.dto.SearchCondition;
import kr.jipsee.deal.repository.DealGroupSearchRepository;
import kr.jipsee.region.RegionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BuildingSearchServiceTest {

    private static final String KEYWORD = "마포구";
    private static final SearchCondition CONDITION =
            new SearchCondition(List.of(), RegionFilter.sigungu(Set.of("11440")), List.of(), List.of());

    @Mock
    SearchKeywordParser searchKeywordParser;

    @Mock
    DealGroupSearchRepository dealGroupSearchRepository;

    @Mock
    CollectStatusService collectStatusService;

    @Mock
    RegionService regionService;

    @InjectMocks
    BuildingSearchService buildingSearchService;

    private static DealGroupRow row(int i, LocalDate latestNewJeonseDate) {
        return new DealGroupRow(
                "11440", "망원동", String.valueOf(i), "빌라" + i, LocalDate.of(2026, 11, 1), latestNewJeonseDate);
    }

    private static List<DealGroupRow> rows(int count) {
        return IntStream.rangeClosed(1, count).mapToObj(i -> row(i, null)).toList();
    }

    private void givenBaseMonth(YearMonth baseMonth) {
        given(collectStatusService.findAll())
                .willReturn(List.of(new DataSourceStatus(CollectSource.RENT_DEAL, baseMonth)));
    }

    @Test
    @DisplayName("20행이면 hasNext가 false이고 21행이면 hasNext가 true이며 20건만 반환함")
    void 이십_행이면_hasNext가_false이고_이십일_행이면_hasNext가_true이며_이십_건만_반환함() {
        // given
        given(searchKeywordParser.parse(KEYWORD)).willReturn(CONDITION);
        given(dealGroupSearchRepository.search(CONDITION, 0)).willReturn(rows(20));
        given(dealGroupSearchRepository.search(CONDITION, 20)).willReturn(rows(21));
        given(regionService.sigunguName("11440")).willReturn("마포구");
        givenBaseMonth(YearMonth.of(2026, 11));

        // when
        DealGroupSearchPage exact = buildingSearchService.search(KEYWORD, 0);
        DealGroupSearchPage more = buildingSearchService.search(KEYWORD, 1);

        // then
        assertThat(exact.buildings()).hasSize(20);
        assertThat(exact.hasNext()).isFalse();
        assertThat(more.buildings()).hasSize(20);
        assertThat(more.hasNext()).isTrue();
    }

    @Test
    @DisplayName("범위를 넘은 page는 빈 결과를 반환함")
    void 범위를_넘은_page는_빈_결과를_반환함() {
        // given
        given(searchKeywordParser.parse(KEYWORD)).willReturn(CONDITION);
        given(dealGroupSearchRepository.search(CONDITION, 2000)).willReturn(List.of());

        // when
        DealGroupSearchPage page = buildingSearchService.search(KEYWORD, 100);

        // then
        assertThat(page.buildings()).isEmpty();
        assertThat(page.hasNext()).isFalse();
        then(collectStatusService).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("page가 int 범위를 넘는 offset도 long으로 계산함")
    void page가_int_범위를_넘는_offset도_long으로_계산함() {
        // given
        given(searchKeywordParser.parse(KEYWORD)).willReturn(CONDITION);
        given(dealGroupSearchRepository.search(CONDITION, 2_147_483_647L * 20)).willReturn(List.of());

        // when
        DealGroupSearchPage page = buildingSearchService.search(KEYWORD, Integer.MAX_VALUE);

        // then
        assertThat(page.buildings()).isEmpty();
    }

    @Test
    @DisplayName("신규 전세 계약일이 기준 월 11개월 전의 1일이면 포함하고 하루 전이면 null임")
    void 신규_전세_계약일이_기준_월_11개월_전의_1일이면_포함하고_하루_전이면_null임() {
        // given
        given(searchKeywordParser.parse(KEYWORD)).willReturn(CONDITION);
        given(dealGroupSearchRepository.search(CONDITION, 0))
                .willReturn(List.of(
                        row(1, LocalDate.of(2025, 12, 1)),
                        row(2, LocalDate.of(2025, 11, 30)),
                        row(3, null),
                        row(4, LocalDate.of(2026, 11, 30))));
        given(regionService.sigunguName("11440")).willReturn("마포구");
        givenBaseMonth(YearMonth.of(2026, 11));

        // when
        DealGroupSearchPage page = buildingSearchService.search(KEYWORD, 0);

        // then
        assertThat(page.buildings())
                .extracting(summary -> summary.latestNewJeonseMonth())
                .containsExactly(YearMonth.of(2025, 12), null, null, YearMonth.of(2026, 11));
    }

    @Test
    @DisplayName("id와 이름과 지번 주소를 조립함")
    void id와_이름과_지번_주소를_조립함() {
        // given
        given(searchKeywordParser.parse(KEYWORD)).willReturn(CONDITION);
        given(dealGroupSearchRepository.search(CONDITION, 0)).willReturn(List.of(row(1, null)));
        given(regionService.sigunguName("11440")).willReturn("마포구");
        givenBaseMonth(YearMonth.of(2026, 11));

        // when
        DealGroupSearchPage page = buildingSearchService.search(KEYWORD, 0);

        // then
        assertThat(page.buildings()).singleElement().satisfies(summary -> {
            assertThat(summary.key()).isEqualTo(new BuildingKey("11440", "망원동", "1"));
            assertThat(summary.name()).isEqualTo("빌라1");
            assertThat(summary.lotAddress()).isEqualTo("마포구 망원동 1");
        });
    }

    @Test
    @DisplayName("시군구명을 찾을 수 없으면 IllegalStateException을 던짐")
    void 시군구명을_찾을_수_없으면_IllegalStateException을_던짐() {
        // given
        given(searchKeywordParser.parse(KEYWORD)).willReturn(CONDITION);
        given(dealGroupSearchRepository.search(CONDITION, 0)).willReturn(List.of(row(1, null)));
        given(regionService.sigunguName("11440")).willReturn(null);
        givenBaseMonth(YearMonth.of(2026, 11));

        // when
        Throwable thrown = catchThrowable(() -> buildingSearchService.search(KEYWORD, 0));

        // then
        assertThat(thrown).isInstanceOf(IllegalStateException.class).hasMessageContaining("11440");
    }

    @Test
    @DisplayName("검색할 수 없는 조건이면 저장소를 호출하지 않고 빈 결과를 반환함")
    void 검색할_수_없는_조건이면_저장소를_호출하지_않고_빈_결과를_반환함() {
        // given
        SearchCondition unsearchable = new SearchCondition(List.of("5"), RegionFilter.absent(), List.of(), List.of());
        given(searchKeywordParser.parse("5")).willReturn(unsearchable);

        // when
        DealGroupSearchPage page = buildingSearchService.search("5", 0);

        // then
        assertThat(page.buildings()).isEmpty();
        assertThat(page.hasNext()).isFalse();
        then(dealGroupSearchRepository).should(never()).search(any(), anyLong());
    }

    @Test
    @DisplayName("결과가 있는데 RENT_DEAL 기준 월 행이 없으면 IllegalStateException을 던짐")
    void 결과가_있는데_RENT_DEAL_기준_월_행이_없으면_IllegalStateException을_던짐() {
        // given
        given(searchKeywordParser.parse(KEYWORD)).willReturn(CONDITION);
        given(dealGroupSearchRepository.search(CONDITION, 0)).willReturn(List.of(row(1, null)));
        given(collectStatusService.findAll())
                .willReturn(List.of(new DataSourceStatus(CollectSource.SALE_DEAL, YearMonth.of(2026, 11))));

        // when
        Throwable thrown = catchThrowable(() -> buildingSearchService.search(KEYWORD, 0));

        // then
        assertThat(thrown).isInstanceOf(IllegalStateException.class);
    }
}
