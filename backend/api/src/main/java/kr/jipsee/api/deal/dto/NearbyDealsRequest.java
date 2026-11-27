package kr.jipsee.api.deal.dto;

import static kr.jipsee.api.exception.ValidationPayload.InvalidRequest;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import kr.jipsee.api.deal.validation.AllowedInts;
import kr.jipsee.deal.dto.DealType;

/**
 * 주변 거래 조회 요청
 *
 * - 값이 없거나 비어 있으면 period 12, type jeonse, page 0
 */
public record NearbyDealsRequest(
        @AllowedInts(
                value = {6, 12, 24},
                payload = InvalidRequest.class)
        Integer period,

        @Pattern(regexp = "jeonse|wolse", payload = InvalidRequest.class)
        String type,

        @Min(value = 0, payload = InvalidRequest.class) Integer page) {

    public NearbyDealsRequest {
        period = period == null ? 12 : period;
        type = type == null || type.isEmpty() ? DealType.JEONSE.code() : type;
        page = page == null ? 0 : page;
    }

    /** 검사를 통과한 type의 거래 유형 */
    public DealType dealType() {
        return DealType.fromCode(type);
    }
}
