package kr.jipsee.matching.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.IntStream;
import kr.jipsee.building.client.BldRgstHubClient;
import kr.jipsee.building.dto.BuildingRegisterRow;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.building.dto.ParcelYears;
import kr.jipsee.building.service.BuildingParcelService;
import kr.jipsee.global.common.TimeZones;
import kr.jipsee.global.publicdata.PublicDataPage;
import kr.jipsee.global.publicdata.PublicDataQuotaExceededException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ParcelFetcherTest {

    private static final ParcelKey KEY = new ParcelKey("11350", "10400", "0", "0130", "0069");
    private static final LocalDateTime NOW = LocalDateTime.of(2026, 11, 15, 9, 0);
    private static final LocalDateTime LOADED_AT = LocalDateTime.of(2026, 11, 5, 5, 0);
    private static final ParcelYears YEARS = new ParcelYears(7L, true, Set.of(2004));

    @Mock
    BldRgstHubClient client;

    @Mock
    BuildingParcelService parcelService;

    ParcelFetcher fetcher;

    @BeforeEach
    void setUp() {
        Clock clock = Clock.fixed(NOW.atZone(TimeZones.SEOUL).toInstant(), TimeZones.SEOUL);
        fetcher = new ParcelFetcher(client, parcelService, clock);
    }

    private static List<BuildingRegisterRow> rows(int from, int count) {
        return IntStream.range(from, from + count)
                .mapToObj(i -> new BuildingRegisterRow(
                        KEY, "pk" + i, "주소", null, null, null, "1", null, null, null, null, null, null, null, null,
                        null, null, null, null, null))
                .toList();
    }

    private static PublicDataPage<BuildingRegisterRow> page(int totalCount, List<BuildingRegisterRow> items) {
        return new PublicDataPage<>("00", totalCount, items);
    }

    @Test
    @DisplayName("기록이 없으면 조회해 저장 결과를 반환함")
    void 기록이_없으면_조회해_저장_결과를_반환함() {
        List<BuildingRegisterRow> rows = rows(0, 2);
        given(parcelService.findLookedUpAt(KEY)).willReturn(Optional.empty());
        given(client.fetch(KEY, 1)).willReturn(page(2, rows));
        given(parcelService.storeLookedUp(KEY, rows, NOW)).willReturn(Optional.of(YEARS));

        Optional<ParcelYears> result = fetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT));

        assertThat(result).contains(YEARS);
    }

    @Test
    @DisplayName("조회 시각이 수집 시각보다 늦으면 조회하지 않음")
    void 조회_시각이_수집_시각보다_늦으면_조회하지_않음() {
        given(parcelService.findLookedUpAt(KEY)).willReturn(Optional.of(LocalDateTime.of(2026, 11, 10, 0, 0)));

        Optional<ParcelYears> result = fetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT));

        assertThat(result).isEmpty();
        then(client).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("조회 시각이 수집 시각보다 이전이면 다시 조회함")
    void 조회_시각이_수집_시각보다_이전이면_다시_조회함() {
        given(parcelService.findLookedUpAt(KEY)).willReturn(Optional.of(LocalDateTime.of(2026, 10, 1, 0, 0)));
        given(client.fetch(KEY, 1)).willReturn(page(0, List.of()));
        given(parcelService.storeLookedUp(KEY, List.of(), NOW)).willReturn(Optional.empty());

        fetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT));

        then(client).should().fetch(KEY, 1);
    }

    @Test
    @DisplayName("조회 시각과 수집 시각이 같으면 조회하지 않음")
    void 조회_시각과_수집_시각이_같으면_조회하지_않음() {
        given(parcelService.findLookedUpAt(KEY)).willReturn(Optional.of(LOADED_AT));

        Optional<ParcelYears> result = fetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT));

        assertThat(result).isEmpty();
        then(client).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("수집 시각이 없으면 기록과 상관없이 조회하지 않음")
    void 수집_시각이_없으면_기록과_상관없이_조회하지_않음() {
        Optional<ParcelYears> result = fetcher.fetchIfNeeded(KEY, Optional.empty());

        assertThat(result).isEmpty();
        then(client).shouldHaveNoInteractions();
        then(parcelService).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("모든 페이지를 받아 저장함")
    void 모든_페이지를_받아_저장함() {
        List<BuildingRegisterRow> all = rows(0, 250);
        given(parcelService.findLookedUpAt(KEY)).willReturn(Optional.empty());
        given(client.fetch(KEY, 1)).willReturn(page(250, all.subList(0, 100)));
        given(client.fetch(KEY, 2)).willReturn(page(250, all.subList(100, 200)));
        given(client.fetch(KEY, 3)).willReturn(page(250, all.subList(200, 250)));
        given(parcelService.storeLookedUp(KEY, all, NOW)).willReturn(Optional.of(YEARS));

        Optional<ParcelYears> result = fetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT));

        assertThat(result).contains(YEARS);
        then(client).should().fetch(KEY, 1);
        then(client).should().fetch(KEY, 2);
        then(client).should().fetch(KEY, 3);
        then(client).shouldHaveNoMoreInteractions();
    }

    @Test
    @DisplayName("응답이 0건이어도 빈 행으로 저장 메서드를 호출함")
    void 응답이_0건이어도_빈_행으로_저장_메서드를_호출함() {
        given(parcelService.findLookedUpAt(KEY)).willReturn(Optional.empty());
        given(client.fetch(KEY, 1)).willReturn(page(0, List.of()));
        given(parcelService.storeLookedUp(KEY, List.of(), NOW)).willReturn(Optional.empty());

        Optional<ParcelYears> result = fetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT));

        assertThat(result).isEmpty();
        then(parcelService).should().storeLookedUp(KEY, List.of(), NOW);
        then(client).should().fetch(KEY, 1);
        then(client).shouldHaveNoMoreInteractions();
    }

    @Test
    @DisplayName("받은 건수가 totalCount와 다르면 저장하지 않고 빈 값을 반환함")
    void 받은_건수가_totalCount와_다르면_저장하지_않고_빈_값을_반환함() {
        given(parcelService.findLookedUpAt(KEY)).willReturn(Optional.empty());
        given(client.fetch(KEY, 1)).willReturn(page(3, rows(0, 2)));
        given(client.fetch(KEY, 2)).willReturn(page(3, List.of()));

        Optional<ParcelYears> result = fetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT));

        assertThat(result).isEmpty();
        then(parcelService).should(never()).storeLookedUp(any(), any(), any());
    }

    @Test
    @DisplayName("한도 초과 예외는 그대로 던지고 저장하지 않음")
    void 한도_초과_예외는_그대로_던지고_저장하지_않음() {
        given(parcelService.findLookedUpAt(KEY)).willReturn(Optional.empty());
        given(client.fetch(KEY, 1)).willThrow(new PublicDataQuotaExceededException("한도 초과"));

        Throwable thrown = catchThrowable(() -> fetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT)));

        assertThat(thrown).isInstanceOf(PublicDataQuotaExceededException.class);
        then(parcelService).should(never()).storeLookedUp(any(), any(), any());
        then(client).should().fetch(KEY, 1);
        then(client).shouldHaveNoMoreInteractions();
    }
}
