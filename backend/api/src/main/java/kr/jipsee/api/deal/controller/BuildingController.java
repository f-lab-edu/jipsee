package kr.jipsee.api.deal.controller;

import jakarta.validation.Valid;
import kr.jipsee.api.common.ApiResponse;
import kr.jipsee.api.deal.dto.BuildingDetailResponse;
import kr.jipsee.api.deal.dto.BuildingSearchRequest;
import kr.jipsee.api.deal.dto.BuildingSearchResponse;
import kr.jipsee.api.deal.dto.NearbyDealsRequest;
import kr.jipsee.api.deal.dto.NearbyDealsResponse;
import kr.jipsee.deal.dto.BuildingKey;
import kr.jipsee.deal.dto.DealType;
import kr.jipsee.deal.service.BuildingSearchService;
import kr.jipsee.deal.service.BuildingService;
import kr.jipsee.global.exception.BusinessException;
import kr.jipsee.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/** 건물 조회 */
@RestController
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingService buildingService;
    private final BuildingSearchService buildingSearchService;

    /** 건물 검색. 요청 검사는 BuildingSearchRequest가 수행 */
    @GetMapping("/buildings")
    public ApiResponse<BuildingSearchResponse> search(@Valid @ModelAttribute BuildingSearchRequest request) {
        return ApiResponse.of(
                BuildingSearchResponse.from(buildingSearchService.search(request.keyword(), request.page())));
    }

    /** 건물 상세 조회. id 형식이 맞지 않으면 BUILDING_NOT_FOUND 반환 */
    @GetMapping("/buildings/{id}")
    public ApiResponse<BuildingDetailResponse> getBuilding(@PathVariable String id) {
        BuildingKey key = BuildingKey.parse(id).orElseThrow(() -> new BusinessException(ErrorCode.BUILDING_NOT_FOUND));

        return ApiResponse.of(BuildingDetailResponse.from(buildingService.find(key)));
    }

    /** 주변 전월세 거래 조회. 요청 검사는 NearbyDealsRequest가 수행하며 id 형식 검사보다 먼저 수행됨 */
    @GetMapping("/buildings/{id}/nearby-deals")
    public ApiResponse<NearbyDealsResponse> getNearbyDeals(
            @PathVariable String id, @Valid @ModelAttribute NearbyDealsRequest request) {
        BuildingKey key = BuildingKey.parse(id).orElseThrow(() -> new BusinessException(ErrorCode.BUILDING_NOT_FOUND));

        return ApiResponse.of(NearbyDealsResponse.from(buildingService.findNearbyDeals(
                key, request.period(), request.dealType() == DealType.JEONSE, request.page())));
    }
}
