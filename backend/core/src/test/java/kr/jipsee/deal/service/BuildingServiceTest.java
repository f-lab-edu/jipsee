package kr.jipsee.deal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import kr.jipsee.deal.dto.AreaRange;
import kr.jipsee.deal.dto.BuildingInfo;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.CollectStatusRow;
import kr.jipsee.deal.dto.DealHistory;
import kr.jipsee.deal.dto.DealType;
import kr.jipsee.deal.dto.GroupDeal;
import kr.jipsee.deal.dto.NearbyDealItem;
import kr.jipsee.deal.dto.NearbyDealRow;
import kr.jipsee.deal.dto.NearbyDeals;
import kr.jipsee.deal.repository.BuildingRepository;
import kr.jipsee.deal.repository.CollectStatusRepository;
import kr.jipsee.global.exception.BusinessException;
import kr.jipsee.global.exception.ErrorCode;
import kr.jipsee.region.RegionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BuildingServiceTest {

    @Mock
    BuildingRepository buildingRepository;

    @Mock
    CollectStatusRepository collectStatusRepository;

    @Mock
    RegionService regionService;

    @InjectMocks
    BuildingService buildingService;

    private static GroupDeal deal(long id) {
        return new GroupDeal(
                id, YearMonth.of(2026, 9), DealType.JEONSE, null, new BigDecimal("59.99"), 30000, null, false);
    }

    @Nested
    @DisplayName("find")
    class Find {

        @Test
        @DisplayName("정상 조회하면 이력 순서 그대로 이름과 주소를 채워 반환함")
        void 정상_조회하면_이력_순서_그대로_이름과_주소를_채워_반환함() {
            // given
            BuildingKey key = new BuildingKey("11440", "망원동", "519");
            List<GroupDeal> deals = List.of(deal(2), deal(1));
            given(buildingRepository.findHistory(key)).willReturn(Optional.of(new DealHistory(key, "망원 OO빌라", deals)));
            given(regionService.sigunguName("11440")).willReturn("마포구");

            // when
            BuildingInfo info = buildingService.find(key);

            // then
            assertThat(info.deals()).containsExactlyElementsOf(deals);
            assertThat(info.name()).isEqualTo("망원 OO빌라");
            assertThat(info.address()).isEqualTo("마포구 망원동 519");
        }

        @Test
        @DisplayName("요청 키가 아니라 저장소가 반환한 키를 사용함")
        void 요청_키가_아니라_저장소가_반환한_키를_사용함() {
            // given
            BuildingKey requested = new BuildingKey("11440", "망원동", "５１９");
            BuildingKey stored = new BuildingKey("11440", "망원동", "519");
            given(buildingRepository.findHistory(requested))
                    .willReturn(Optional.of(new DealHistory(stored, null, List.of(deal(1)))));
            given(regionService.sigunguName("11440")).willReturn("마포구");

            // when
            BuildingInfo info = buildingService.find(requested);

            // then
            assertThat(info.key()).isEqualTo(stored);
            assertThat(info.name()).isNull();
            assertThat(info.address()).isEqualTo("마포구 망원동 519");
        }

        @Test
        @DisplayName("시군구명을 찾을 수 없으면 IllegalStateException을 던짐")
        void 시군구명을_찾을_수_없으면_IllegalStateException을_던짐() {
            // given
            BuildingKey key = new BuildingKey("99999", "망원동", "519");
            given(buildingRepository.findHistory(key))
                    .willReturn(Optional.of(new DealHistory(key, "망원 OO빌라", List.of(deal(1)))));
            given(regionService.sigunguName("99999")).willReturn(null);

            // when
            Throwable thrown = catchThrowable(() -> buildingService.find(key));

            // then
            assertThat(thrown).isInstanceOf(IllegalStateException.class).hasMessageContaining("99999");
        }

        @Test
        @DisplayName("이력이 없으면 BUILDING_NOT_FOUND를 던지고 시군구명을 조회하지 않음")
        void 이력이_없으면_BUILDING_NOT_FOUND를_던지고_시군구명을_조회하지_않음() {
            // given
            BuildingKey key = new BuildingKey("11440", "망원동", "519");
            given(buildingRepository.findHistory(key)).willReturn(Optional.empty());

            // when
            Throwable thrown = catchThrowable(() -> buildingService.find(key));

            // then
            assertThat(thrown)
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.BUILDING_NOT_FOUND);
            then(regionService).should(never()).sigunguName(any());
        }
    }

    @Nested
    @DisplayName("findNearbyDeals")
    class FindNearbyDeals {

        private static final BuildingKey KEY = new BuildingKey("11440", "망원동", "519");
        private static final LocalDateTime LOADED_AT = LocalDateTime.of(2026, 11, 19, 4, 2);

        private void givenBase(LocalDateTime loadedAt, String min, String max) {
            given(buildingRepository.findAreaRange(KEY))
                    .willReturn(Optional.of(new AreaRange(new BigDecimal(min), new BigDecimal(max))));
            given(collectStatusRepository.findAll()).willReturn(List.of(new CollectStatusRow("RENT_DEAL", loadedAt)));
        }

        private void givenNearby(List<NearbyDealRow> rows, long totalCount) {
            given(buildingRepository.findNearbyDeals(any(), any(), any(), any(), anyBoolean(), anyLong()))
                    .willReturn(rows);
            given(buildingRepository.countNearbyDeals(any(), any(), any(), any(), anyBoolean()))
                    .willReturn(totalCount);
        }

        private static NearbyDealRow row(long id, String houseName, String lotNumber) {
            return new NearbyDealRow(
                    id,
                    DealType.JEONSE,
                    YearMonth.of(2026, 9),
                    null,
                    new BigDecimal("59.99"),
                    30000,
                    null,
                    houseName,
                    "11440",
                    "망원동",
                    lotNumber);
        }

        private static List<NearbyDealRow> rows(int size) {
            return IntStream.rangeClosed(1, size)
                    .mapToObj(id -> row(id, "망원 OO빌라", "519"))
                    .toList();
        }

        @Test
        @DisplayName("기준 건물에 거래가 없으면 BUILDING_NOT_FOUND를 던지고 목록과 collect_status를 조회하지 않음")
        void 기준_건물에_거래가_없으면_BUILDING_NOT_FOUND를_던지고_목록과_collect_status를_조회하지_않음() {
            // given
            given(buildingRepository.findAreaRange(KEY)).willReturn(Optional.empty());

            // when
            Throwable thrown = catchThrowable(() -> buildingService.findNearbyDeals(KEY, 12, true, 0));

            // then
            assertThat(thrown)
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.BUILDING_NOT_FOUND);
            then(collectStatusRepository).shouldHaveNoInteractions();
            then(buildingRepository)
                    .should(never())
                    .findNearbyDeals(any(), any(), any(), any(), anyBoolean(), anyLong());
        }

        @ParameterizedTest
        @CsvSource({"12,2025-12-01,2026-11-30"})
        @DisplayName("월 중간의 loaded_at에서 기준 월을 포함한 period개월 기간을 계산함")
        void 월_중간의_loaded_at에서_기준_월을_포함한_period개월_기간을_계산함(int period, LocalDate from, LocalDate to) {
            // given
            givenBase(LOADED_AT, "30.00", "40.00");
            AreaRange range = new AreaRange(new BigDecimal("20.00"), new BigDecimal("50.00"));

            // when
            buildingService.findNearbyDeals(KEY, period, true, 0);

            // then
            then(buildingRepository).should().findNearbyDeals(KEY, from, to, range, true, 0L);
            then(buildingRepository).should().countNearbyDeals(KEY, from, to, range, true);
        }

        @ParameterizedTest
        @CsvSource({"12,2025-03-01,2026-02-28"})
        @DisplayName("2월의 loaded_at에서 말일을 28일로 계산함")
        void 월의_loaded_at에서_말일을_28일로_계산함(int period, LocalDate from, LocalDate to) {
            // given
            givenBase(LocalDateTime.of(2026, 2, 10, 4, 0), "30.00", "40.00");
            AreaRange range = new AreaRange(new BigDecimal("20.00"), new BigDecimal("50.00"));

            // when
            buildingService.findNearbyDeals(KEY, period, true, 0);

            // then
            then(buildingRepository).should().findNearbyDeals(KEY, from, to, range, true, 0L);
        }

        @ParameterizedTest
        @ValueSource(booleans = {false})
        @DisplayName("입력 키와 유형을 저장소에 그대로 전달함")
        void 입력_키와_유형을_저장소에_그대로_전달함(boolean jeonse) {
            // given
            givenBase(LOADED_AT, "30.00", "40.00");

            // when
            buildingService.findNearbyDeals(KEY, 12, jeonse, 0);

            // then
            then(buildingRepository).should().findNearbyDeals(eq(KEY), any(), any(), any(), eq(jeonse), anyLong());
            then(buildingRepository).should().countNearbyDeals(eq(KEY), any(), any(), any(), eq(jeonse));
        }

        @ParameterizedTest
        @CsvSource({"45,0,20,true", "20,0,20,false"})
        @DisplayName("hasNext는 앞선 페이지와 현재 건수의 합이 totalCount보다 작을 때 true이고 totalCount는 저장소 값 그대로임")
        void hasNext는_앞선_페이지와_현재_건수의_합이_totalCount보다_작을_때_true이고_totalCount는_저장소_값_그대로임(
                long totalCount, int page, int listSize, boolean hasNext) {
            // given
            givenBase(LOADED_AT, "30.00", "40.00");
            givenNearby(rows(listSize), totalCount);

            // when
            NearbyDeals result = buildingService.findNearbyDeals(KEY, 12, true, page);

            // then
            assertThat(result.hasNext()).isEqualTo(hasNext);
            assertThat(result.totalCount()).isEqualTo(totalCount);
            assertThat(result.deals()).hasSize(listSize);
        }

        @Test
        @DisplayName("큰 page도 long으로 계산한 offset을 전달함")
        void 큰_page도_long으로_계산한_offset을_전달함() {
            // given
            givenBase(LOADED_AT, "30.00", "40.00");

            // when
            buildingService.findNearbyDeals(KEY, 12, true, 107374183);

            // then
            then(buildingRepository).should().findNearbyDeals(eq(KEY), any(), any(), any(), eq(true), eq(2147483660L));
        }

        @Test
        @DisplayName("collect_status에 SALE_DEAL만 있으면 IllegalStateException을 던지고 목록과 건수를 조회하지 않음")
        void collect_status에_SALE_DEAL만_있으면_IllegalStateException을_던지고_목록과_건수를_조회하지_않음() {
            // given
            given(buildingRepository.findAreaRange(KEY))
                    .willReturn(Optional.of(new AreaRange(new BigDecimal("30.00"), new BigDecimal("40.00"))));
            given(collectStatusRepository.findAll()).willReturn(List.of(new CollectStatusRow("SALE_DEAL", LOADED_AT)));

            // when
            Throwable thrown = catchThrowable(() -> buildingService.findNearbyDeals(KEY, 12, true, 0));

            // then
            assertThat(thrown).isInstanceOf(IllegalStateException.class);
            then(buildingRepository)
                    .should(never())
                    .findNearbyDeals(any(), any(), any(), any(), anyBoolean(), anyLong());
            then(buildingRepository).should(never()).countNearbyDeals(any(), any(), any(), any(), anyBoolean());
        }

        @Test
        @DisplayName("houseName이 있으면 그대로, null이면 주소로 건물명을 대체함")
        void houseName이_있으면_그대로_null이면_주소로_건물명을_대체함() {
            // given
            givenBase(LOADED_AT, "30.00", "40.00");
            givenNearby(List.of(row(1, "망원 OO빌라", "519"), row(2, null, "519"), row(3, null, null)), 3);
            given(regionService.sigunguName("11440")).willReturn("마포구");

            // when
            NearbyDeals result = buildingService.findNearbyDeals(KEY, 12, true, 0);

            // then
            assertThat(result.deals())
                    .extracting(NearbyDealItem::buildingName)
                    .containsExactly("망원 OO빌라", "마포구 망원동 519", "마포구 망원동");
        }
    }
}
