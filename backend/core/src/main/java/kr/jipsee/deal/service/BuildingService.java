package kr.jipsee.deal.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import kr.jipsee.deal.dto.AreaRange;
import kr.jipsee.deal.dto.BuildingInfo;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.DealHistory;
import kr.jipsee.deal.dto.NearbyDealItem;
import kr.jipsee.deal.dto.NearbyDealRow;
import kr.jipsee.deal.dto.NearbyDeals;
import kr.jipsee.deal.repository.BuildingRepository;
import kr.jipsee.deal.repository.CollectStatusRepository;
import kr.jipsee.global.exception.BusinessException;
import kr.jipsee.global.exception.ErrorCode;
import kr.jipsee.region.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 건물 조회 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuildingService {

    private static final String RENT_SOURCE = "RENT_DEAL";
    private static final int PAGE_SIZE = 20;
    private static final BigDecimal AREA_MARGIN = BigDecimal.TEN;

    private final BuildingRepository buildingRepository;
    private final CollectStatusRepository collectStatusRepository;
    private final RegionService regionService;

    /** 건물 상세 조회. 이력이 없으면 BUILDING_NOT_FOUND 예외 발생 */
    public BuildingInfo find(BuildingKey key) {
        DealHistory history = buildingRepository
                .findHistory(key)
                .orElseThrow(() -> new BusinessException(ErrorCode.BUILDING_NOT_FOUND));
        BuildingKey found = history.key();

        return new BuildingInfo(
                found,
                history.houseName(),
                address(found.sigunguCode(), found.legalDongName(), found.lotNumber()),
                history.deals());
    }

    /**
     * 같은 법정동의 주변 전월세 거래 한 페이지 조회
     * - period와 page는 컨트롤러가 이미 검사하므로 서비스는 다시 검사하지 않음
     * - 기준 건물에 전용면적이 0보다 큰 거래가 없으면 BUILDING_NOT_FOUND 예외 발생
     */
    public NearbyDeals findNearbyDeals(BuildingKey key, int period, boolean jeonse, int page) {
        AreaRange base = buildingRepository
                .findAreaRange(key)
                .orElseThrow(() -> new BusinessException(ErrorCode.BUILDING_NOT_FOUND));
        AreaRange range =
                new AreaRange(base.min().subtract(AREA_MARGIN), base.max().add(AREA_MARGIN));

        LocalDateTime loadedAt = collectStatusRepository.findAll().stream()
                .filter(row -> RENT_SOURCE.equals(row.source()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("collect_status에 RENT_DEAL 행이 없습니다."))
                .loadedAt();
        YearMonth baseMonth = YearMonth.from(loadedAt);
        LocalDate from = baseMonth.minusMonths(period - 1).atDay(1);
        LocalDate to = baseMonth.atEndOfMonth();

        long offset = (long) page * PAGE_SIZE;
        List<NearbyDealItem> deals = buildingRepository.findNearbyDeals(key, from, to, range, jeonse, offset).stream()
                .map(this::toItem)
                .toList();
        long totalCount = buildingRepository.countNearbyDeals(key, from, to, range, jeonse);

        return new NearbyDeals(deals, offset + deals.size() < totalCount, totalCount);
    }

    /** 건물명이 없으면 지번 주소로 대체해 주변 거래 항목 생성 */
    private NearbyDealItem toItem(NearbyDealRow row) {
        String buildingName = row.houseName() != null
                ? row.houseName()
                : address(row.sigunguCode(), row.legalDongName(), row.lotNumber());

        return new NearbyDealItem(
                row.id(),
                row.type(),
                buildingName,
                row.month(),
                row.contract(),
                row.exclusiveArea(),
                row.amount(),
                row.monthlyRent());
    }

    /** 시군구명, 법정동명, 지번으로 주소 조립. 지번이 null이면 지번 제외 */
    private String address(String sigunguCode, String legalDongName, String lotNumber) {
        String base = regionService.sigunguName(sigunguCode) + " " + legalDongName;

        return lotNumber == null ? base : base + " " + lotNumber;
    }
}
