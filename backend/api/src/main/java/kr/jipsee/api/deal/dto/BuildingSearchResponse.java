package kr.jipsee.api.deal.dto;

import java.util.List;
import kr.jipsee.deal.dto.DealGroupSearchPage;

/** 건물 검색 한 페이지 응답 */
public record BuildingSearchResponse(List<BuildingSummaryResponse> buildings, boolean hasNext) {

    /** 서비스 결과를 응답으로 변환 */
    public static BuildingSearchResponse from(DealGroupSearchPage page) {
        return new BuildingSearchResponse(
                page.buildings().stream().map(BuildingSummaryResponse::from).toList(), page.hasNext());
    }
}
