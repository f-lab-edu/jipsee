package kr.jipsee.api.deal.dto;

import java.util.List;
import kr.jipsee.deal.dto.BuildingInfo;

/** 건물 상세 응답 */
public record BuildingDetailResponse(String id, String name, String address, List<BuildingDealResponse> deals) {

    /** 서비스 결과를 응답으로 변환. id는 info.key().id() */
    public static BuildingDetailResponse from(BuildingInfo info) {
        return new BuildingDetailResponse(
                info.key().id(),
                info.name(),
                info.address(),
                info.deals().stream().map(BuildingDealResponse::from).toList());
    }
}
