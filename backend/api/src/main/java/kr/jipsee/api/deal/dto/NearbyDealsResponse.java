package kr.jipsee.api.deal.dto;

import java.util.List;
import kr.jipsee.deal.dto.NearbyDeals;

/** 주변 거래 한 페이지 응답 */
public record NearbyDealsResponse(List<NearbyDealResponse> deals, boolean hasNext, long totalCount) {

    /** 서비스 결과를 응답으로 변환 */
    public static NearbyDealsResponse from(NearbyDeals nearbyDeals) {
        return new NearbyDealsResponse(
                nearbyDeals.deals().stream().map(NearbyDealResponse::from).toList(),
                nearbyDeals.hasNext(),
                nearbyDeals.totalCount());
    }
}
