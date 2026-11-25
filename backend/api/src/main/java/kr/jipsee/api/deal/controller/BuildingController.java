package kr.jipsee.api.deal.controller;

import java.util.Set;
import kr.jipsee.api.common.ApiResponse;
import kr.jipsee.api.deal.dto.BuildingDetailResponse;
import kr.jipsee.api.deal.dto.NearbyDealsResponse;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.DealType;
import kr.jipsee.deal.service.BuildingService;
import kr.jipsee.global.exception.BusinessException;
import kr.jipsee.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 건물 조회 */
@RestController
@RequiredArgsConstructor
public class BuildingController {

    private static final Set<Integer> PERIODS = Set.of(6, 12, 24);
    private static final Set<DealType> TYPES = Set.of(DealType.JEONSE, DealType.WOLSE);

    private final BuildingService buildingService;

    /** 건물 상세 조회. id 형식이 맞지 않으면 BUILDING_NOT_FOUND 반환 */
    @GetMapping("/buildings/{id}")
    public ApiResponse<BuildingDetailResponse> getBuilding(@PathVariable String id) {
        BuildingKey key = BuildingKey.parse(id).orElseThrow(() -> new BusinessException(ErrorCode.BUILDING_NOT_FOUND));

        return ApiResponse.of(BuildingDetailResponse.from(buildingService.find(key)));
    }

    /** 주변 전월세 거래 조회 */
    @GetMapping("/buildings/{id}/nearby-deals")
    public ApiResponse<NearbyDealsResponse> getNearbyDeals(
            @PathVariable String id,
            @RequestParam(defaultValue = "12") int period,
            @RequestParam(defaultValue = "jeonse") String type,
            @RequestParam(defaultValue = "0") int page) {
        DealType dealType = parseDealType(type);
        if (!PERIODS.contains(period) || !TYPES.contains(dealType) || page < 0) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        BuildingKey key = BuildingKey.parse(id).orElseThrow(() -> new BusinessException(ErrorCode.BUILDING_NOT_FOUND));

        return ApiResponse.of(NearbyDealsResponse.from(
                buildingService.findNearbyDeals(key, period, dealType == DealType.JEONSE, page)));
    }

    private DealType parseDealType(String type) {
        try {
            return DealType.fromCode(type);
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }
    }
}
