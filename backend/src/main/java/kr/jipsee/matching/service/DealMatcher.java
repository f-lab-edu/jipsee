package kr.jipsee.matching.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.building.dto.ParcelYears;
import kr.jipsee.building.service.BuildingParcelService;
import kr.jipsee.global.publicdata.PublicDataQuotaExceededException;
import kr.jipsee.matching.dto.DealMatchResult;
import kr.jipsee.matching.dto.DealMatchTarget;
import kr.jipsee.matching.dto.MatchStatus;
import kr.jipsee.region.dto.LegalDongKey;
import kr.jipsee.region.service.RegionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 거래 목록의 법정동과 지번을 필지로 변경하고, 필지의 사용승인 연도와 대조하여 매칭 결과를 판정
 * - 스프링 빈으로 선언하지 않음
 * - Step 실행마다 새로 생성하여, 단건 조회가 중지된 상태가 다음 실행으로 이어지지 않게 하기 위함
 */
@Slf4j
@RequiredArgsConstructor
public class DealMatcher {
    private final RegionService regionService;
    private final BuildingParcelService parcelService;
    private final ParcelFetcher parcelFetcher;
    private final Optional<LocalDateTime> registerLoadedAt;

    /** 건축HUB 한도 초과로 인해 단건 조회를 멈춘 경우 true */
    private boolean singleLookupStopped;

    /** 거래마다 판정한 결과를 입력과 같은 순서로 반환 */
    public List<DealMatchResult> match(List<DealMatchTarget> deals) {
        Map<LegalDongKey, Map<ParcelKey, ParcelYears>> parcelsByLegalDong = new HashMap<>();
        Set<ParcelKey> attempted = new HashSet<>();
        List<DealMatchResult> results = new ArrayList<>();

        for (DealMatchTarget deal : deals) {
            results.add(matchDeal(deal, parcelsByLegalDong, attempted));
        }

        return results;
    }

    private DealMatchResult matchDeal(
            DealMatchTarget deal,
            Map<LegalDongKey, Map<ParcelKey, ParcelYears>> parcelsByLegalDong,
            Set<ParcelKey> attempted) {
        Optional<LegalDongKey> legalDong = regionService.find(deal.sigunguCode(), deal.legalDongName());

        if (legalDong.isEmpty()) {
            return failed(deal);
        }

        Optional<ParcelKey> parcelKey = LotNumbers.toParcelKey(legalDong.get(), deal.lotNumber());

        if (parcelKey.isEmpty()) {
            return failed(deal);
        }

        Map<ParcelKey, ParcelYears> parcels = parcelsByLegalDong.computeIfAbsent(
                legalDong.get(), key -> new HashMap<>(parcelService.findParcelYears(key)));
        ParcelKey key = parcelKey.get();

        if (!parcels.containsKey(key) && !singleLookupStopped && attempted.add(key)) {
            fetchSingle(key).ifPresent(years -> parcels.put(key, years));
        }

        return judge(deal, parcels.get(key));
    }

    /** 단건 조회. 한도 초과이면 조회를 멈추고 경고 로그를 한 줄 남긴 뒤 빈 값 반환 */
    private Optional<ParcelYears> fetchSingle(ParcelKey key) {
        try {
            return parcelFetcher.fetchIfNeeded(key, registerLoadedAt);
        } catch (PublicDataQuotaExceededException e) {
            singleLookupStopped = true;
            log.warn("건축HUB 호출 한도 초과로 필지 단건 조회를 중단함");
            return Optional.empty();
        }
    }

    private static DealMatchResult judge(DealMatchTarget deal, ParcelYears parcel) {
        if (parcel == null || !parcel.hasRegisters()) {
            return failed(deal);
        }

        boolean comparable = deal.buildYear() != null && !parcel.years().isEmpty();

        if (!comparable || parcel.years().contains(deal.buildYear())) {
            return new DealMatchResult(deal.id(), parcel.parcelId(), MatchStatus.CONFIRMED);
        }

        return new DealMatchResult(deal.id(), parcel.parcelId(), MatchStatus.PREVIOUS);
    }

    private static DealMatchResult failed(DealMatchTarget deal) {
        return new DealMatchResult(deal.id(), null, MatchStatus.FAILED);
    }
}
