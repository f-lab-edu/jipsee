package kr.jipsee.api.deal.dto;

import java.math.BigDecimal;
import kr.jipsee.api.common.YearMonthResponse;
import kr.jipsee.deal.dto.NearbyDealItem;

/** 주변 거래 한 건 응답 */
public record NearbyDealResponse(
        long id,
        String type,
        String buildingName,
        YearMonthResponse month,
        String contract,
        BigDecimal exclusiveArea,
        int amount,
        Integer monthlyRent) {

    /** 주변 거래 항목을 응답으로 변환 */
    public static NearbyDealResponse from(NearbyDealItem item) {
        return new NearbyDealResponse(
                item.id(),
                item.type().code(),
                item.buildingName(),
                YearMonthResponse.from(item.month()),
                item.contract() == null ? null : item.contract().code(),
                item.exclusiveArea(),
                item.amount(),
                item.monthlyRent());
    }
}
