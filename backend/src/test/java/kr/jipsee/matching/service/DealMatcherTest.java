package kr.jipsee.matching.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.building.dto.ParcelYears;
import kr.jipsee.building.service.BuildingParcelService;
import kr.jipsee.global.publicdata.PublicDataApiException;
import kr.jipsee.global.publicdata.PublicDataQuotaExceededException;
import kr.jipsee.matching.dto.DealMatchResult;
import kr.jipsee.matching.dto.DealMatchTarget;
import kr.jipsee.matching.dto.MatchStatus;
import kr.jipsee.region.dto.LegalDongKey;
import kr.jipsee.region.service.RegionService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.LoggerFactory;

@ExtendWith(MockitoExtension.class)
class DealMatcherTest {

    private static final LocalDateTime LOADED_AT = LocalDateTime.of(2026, 11, 5, 5, 0);
    private static final LegalDongKey DONG = new LegalDongKey("11350", "10400");
    private static final ParcelKey KEY = new ParcelKey("11350", "10400", "0", "0130", "0069");
    private static final ParcelYears PARCEL = new ParcelYears(7L, true, Set.of(2004));

    @Mock
    RegionService regionService;

    @Mock
    BuildingParcelService parcelService;

    @Mock
    ParcelFetcher parcelFetcher;

    DealMatcher matcher;
    ListAppender<ILoggingEvent> appender;
    Logger matcherLogger;

    @BeforeEach
    void setUp() {
        matcher = new DealMatcher(regionService, parcelService, parcelFetcher, Optional.of(LOADED_AT));

        matcherLogger = (Logger) LoggerFactory.getLogger(DealMatcher.class);
        appender = new ListAppender<>();
        appender.start();
        matcherLogger.addAppender(appender);
    }

    @AfterEach
    void tearDown() {
        matcherLogger.detachAppender(appender);
    }

    private static DealMatchTarget deal(long id, String legalDongName, String lotNumber, Integer buildYear) {
        return new DealMatchTarget(id, "11350", legalDongName, lotNumber, buildYear);
    }

    private static DealMatchTarget deal() {
        return deal(1, "하계동", "130-69", 2004);
    }

    private static ParcelKey parcelKey(String mainLotNumber, String subLotNumber) {
        return new ParcelKey("11350", "10400", "0", mainLotNumber, subLotNumber);
    }

    private void givenDong() {
        given(regionService.find("11350", "하계동")).willReturn(Optional.of(DONG));
    }

    private void givenParcels(Map<ParcelKey, ParcelYears> parcels) {
        given(parcelService.findParcelYears(DONG)).willReturn(parcels);
    }

    @Test
    @DisplayName("법정동이 사전에 없으면 FAILED이고 필지를 조회하지 않음")
    void 법정동이_사전에_없으면_FAILED이고_필지를_조회하지_않음() {
        given(regionService.find("11350", "하계동")).willReturn(Optional.empty());

        List<DealMatchResult> results = matcher.match(List.of(deal()));

        assertThat(results).containsExactly(new DealMatchResult(1, null, MatchStatus.FAILED));
        then(parcelService).shouldHaveNoInteractions();
        then(parcelFetcher).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("지번을 변환하지 못하면 FAILED이고 필지를 조회하지 않음")
    void 지번을_변환하지_못하면_FAILED이고_필지를_조회하지_않음() {
        givenDong();

        List<DealMatchResult> results = matcher.match(List.of(deal(1, "하계동", "BL-31-4", 2004)));

        assertThat(results).containsExactly(new DealMatchResult(1, null, MatchStatus.FAILED));
        then(parcelService).shouldHaveNoInteractions();
        then(parcelFetcher).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("지번이 null이면 FAILED이고 필지를 조회하지 않음")
    void 지번이_null이면_FAILED이고_필지를_조회하지_않음() {
        givenDong();

        List<DealMatchResult> results = matcher.match(List.of(deal(1, "하계동", null, 2004)));

        assertThat(results).containsExactly(new DealMatchResult(1, null, MatchStatus.FAILED));
        then(parcelService).shouldHaveNoInteractions();
        then(parcelFetcher).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("필지가 있고 연도가 같으면 CONFIRMED와 필지 ID")
    void 필지가_있고_연도가_같으면_CONFIRMED와_필지_ID() {
        givenDong();
        givenParcels(Map.of(KEY, PARCEL));

        List<DealMatchResult> results = matcher.match(List.of(deal()));

        assertThat(results).containsExactly(new DealMatchResult(1, 7L, MatchStatus.CONFIRMED));
    }

    @Test
    @DisplayName("연도가 다르면 PREVIOUS와 필지 ID")
    void 연도가_다르면_PREVIOUS와_필지_ID() {
        givenDong();
        givenParcels(Map.of(KEY, PARCEL));

        List<DealMatchResult> results = matcher.match(List.of(deal(1, "하계동", "130-69", 1995)));

        assertThat(results).containsExactly(new DealMatchResult(1, 7L, MatchStatus.PREVIOUS));
    }

    @Test
    @DisplayName("여러 동 중 하나라도 연도가 같으면 CONFIRMED")
    void 여러_동_중_하나라도_연도가_같으면_CONFIRMED() {
        givenDong();
        givenParcels(Map.of(KEY, new ParcelYears(7L, true, Set.of(1995, 2004))));

        List<DealMatchResult> results = matcher.match(List.of(deal()));

        assertThat(results).containsExactly(new DealMatchResult(1, 7L, MatchStatus.CONFIRMED));
    }

    @Test
    @DisplayName("건축연도가 null이면 CONFIRMED")
    void 건축연도가_null이면_CONFIRMED() {
        givenDong();
        givenParcels(Map.of(KEY, PARCEL));

        List<DealMatchResult> results = matcher.match(List.of(deal(1, "하계동", "130-69", null)));

        assertThat(results).containsExactly(new DealMatchResult(1, 7L, MatchStatus.CONFIRMED));
    }

    @Test
    @DisplayName("필지의 모든 동의 사용승인일이 null이면 CONFIRMED")
    void 필지의_모든_동의_사용승인일이_null이면_CONFIRMED() {
        givenDong();
        givenParcels(Map.of(KEY, new ParcelYears(7L, true, Set.of())));

        List<DealMatchResult> results = matcher.match(List.of(deal()));

        assertThat(results).containsExactly(new DealMatchResult(1, 7L, MatchStatus.CONFIRMED));
    }

    @Test
    @DisplayName("동 행이 없는 필지는 단건 조회 없이 FAILED")
    void 동_행이_없는_필지는_단건_조회_없이_FAILED() {
        givenDong();
        givenParcels(Map.of(KEY, new ParcelYears(7L, false, Set.of())));

        List<DealMatchResult> results = matcher.match(List.of(deal()));

        assertThat(results).containsExactly(new DealMatchResult(1, null, MatchStatus.FAILED));
        then(parcelFetcher).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("필지가 DB에 없으면 단건 조회로 저장한 필지로 판정함")
    void 필지가_DB에_없으면_단건_조회로_저장한_필지로_판정함() {
        givenDong();
        givenParcels(Map.of());
        given(parcelFetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT)))
                .willReturn(Optional.of(new ParcelYears(9L, true, Set.of(2004))));

        List<DealMatchResult> results = matcher.match(List.of(deal()));

        assertThat(results).containsExactly(new DealMatchResult(1, 9L, MatchStatus.CONFIRMED));
    }

    @Test
    @DisplayName("단건 조회가 저장하지 않으면 FAILED")
    void 단건_조회가_저장하지_않으면_FAILED() {
        givenDong();
        givenParcels(Map.of());
        given(parcelFetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT))).willReturn(Optional.empty());

        List<DealMatchResult> results = matcher.match(List.of(deal()));

        assertThat(results).containsExactly(new DealMatchResult(1, null, MatchStatus.FAILED));
    }

    @Test
    @DisplayName("같은 필지를 가리키는 거래가 여럿이어도 단건 조회는 한 번만 함")
    void 같은_필지를_가리키는_거래가_여럿이어도_단건_조회는_한_번만_함() {
        given(regionService.find("11350", "하계동")).willReturn(Optional.of(DONG));
        givenParcels(Map.of());
        given(parcelFetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT))).willReturn(Optional.empty());

        List<DealMatchResult> results = matcher.match(List.of(
                deal(1, "하계동", "130-69", 2004), deal(2, "하계동", "130-69", 2004), deal(3, "하계동", "130-69", 1995)));

        assertThat(results).extracting(DealMatchResult::status).containsOnly(MatchStatus.FAILED);
        then(parcelFetcher).should(times(1)).fetchIfNeeded(KEY, Optional.of(LOADED_AT));
    }

    @Test
    @DisplayName("법정동마다 필지는 한 번만 읽음")
    void 법정동마다_필지는_한_번만_읽음() {
        given(regionService.find("11350", "하계동")).willReturn(Optional.of(DONG));
        givenParcels(Map.of(
                parcelKey("0130", "0069"), PARCEL,
                parcelKey("0131", "0000"), PARCEL,
                parcelKey("0132", "0001"), PARCEL));

        matcher.match(
                List.of(deal(1, "하계동", "130-69", 2004), deal(2, "하계동", "131", 2004), deal(3, "하계동", "132-1", 2004)));

        then(parcelService).should(times(1)).findParcelYears(DONG);
    }

    @Test
    @DisplayName("한도 초과가 나면 단건 조회를 멈추고 남은 거래는 판정을 이어감")
    void 한도_초과가_나면_단건_조회를_멈추고_남은_거래는_판정을_이어감() {
        givenDong();
        givenParcels(Map.of(parcelKey("0200", "0000"), PARCEL));
        given(parcelFetcher.fetchIfNeeded(any(), any())).willThrow(new PublicDataQuotaExceededException("한도 초과"));

        List<DealMatchResult> results = matcher.match(
                List.of(deal(1, "하계동", "130-69", 2004), deal(2, "하계동", "131", 2004), deal(3, "하계동", "200", 2004)));

        assertThat(results)
                .containsExactly(
                        new DealMatchResult(1, null, MatchStatus.FAILED),
                        new DealMatchResult(2, null, MatchStatus.FAILED),
                        new DealMatchResult(3, 7L, MatchStatus.CONFIRMED));
        then(parcelFetcher).should(times(1)).fetchIfNeeded(any(), any());
    }

    @Test
    @DisplayName("한도 초과 뒤 같은 DealMatcher의 다음 호출에서도 단건 조회를 하지 않음")
    void 한도_초과_뒤_같은_DealMatcher의_다음_호출에서도_단건_조회를_하지_않음() {
        givenDong();
        givenParcels(Map.of());
        given(parcelFetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT)))
                .willThrow(new PublicDataQuotaExceededException("한도 초과"));

        matcher.match(List.of(deal()));
        matcher.match(List.of(deal()));

        then(parcelFetcher).should(times(1)).fetchIfNeeded(KEY, Optional.of(LOADED_AT));

        DealMatcher fresh = new DealMatcher(regionService, parcelService, parcelFetcher, Optional.of(LOADED_AT));
        fresh.match(List.of(deal()));

        then(parcelFetcher).should(times(2)).fetchIfNeeded(KEY, Optional.of(LOADED_AT));
    }

    @Test
    @DisplayName("한도 초과가 나면 경고 로그를 한 줄 남김")
    void 한도_초과가_나면_경고_로그를_한_줄_남김() {
        givenDong();
        givenParcels(Map.of());
        given(parcelFetcher.fetchIfNeeded(any(), any())).willThrow(new PublicDataQuotaExceededException("한도 초과"));

        matcher.match(List.of(deal(1, "하계동", "130-69", 2004), deal(2, "하계동", "131", 2004)));
        matcher.match(List.of(deal(3, "하계동", "132", 2004)));

        assertThat(appender.list)
                .filteredOn(event -> event.getLevel() == Level.WARN)
                .extracting(ILoggingEvent::getFormattedMessage)
                .containsExactly("건축HUB 호출 한도 초과로 필지 단건 조회를 중단함");
    }

    @Test
    @DisplayName("수집 시각을 단건 조회에 그대로 전달함")
    void 수집_시각을_단건_조회에_그대로_전달함() {
        givenDong();
        givenParcels(Map.of());
        DealMatcher withoutLoadedAt = new DealMatcher(regionService, parcelService, parcelFetcher, Optional.empty());
        given(parcelFetcher.fetchIfNeeded(KEY, Optional.empty())).willReturn(Optional.empty());

        withoutLoadedAt.match(List.of(deal()));

        then(parcelFetcher).should().fetchIfNeeded(KEY, Optional.empty());
        then(parcelFetcher).should(never()).fetchIfNeeded(KEY, Optional.of(LOADED_AT));
    }

    @Test
    @DisplayName("한도 초과가 아닌 오류는 그대로 던짐")
    void 한도_초과가_아닌_오류는_그대로_던짐() {
        givenDong();
        givenParcels(Map.of());
        PublicDataApiException exception = new PublicDataApiException("API 오류");
        given(parcelFetcher.fetchIfNeeded(KEY, Optional.of(LOADED_AT))).willThrow(exception);

        Throwable thrown = catchThrowable(() -> matcher.match(List.of(deal())));

        assertThat(thrown).isSameAs(exception);
    }

    @Test
    @DisplayName("결과는 입력 순서와 거래 ID를 유지함")
    void 결과는_입력_순서와_거래_ID를_유지함() {
        given(regionService.find("11350", "없는동")).willReturn(Optional.empty());
        givenDong();
        givenParcels(Map.of(KEY, PARCEL));

        List<DealMatchResult> results = matcher.match(List.of(
                deal(30, "없는동", "130-69", 2004), deal(10, "하계동", "130-69", 2004), deal(20, "하계동", "BL-31-4", 2004)));

        assertThat(results)
                .containsExactly(
                        new DealMatchResult(30, null, MatchStatus.FAILED),
                        new DealMatchResult(10, 7L, MatchStatus.CONFIRMED),
                        new DealMatchResult(20, null, MatchStatus.FAILED));
    }
}
