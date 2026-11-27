package kr.jipsee.api.deal.dto;

import java.math.BigDecimal;
import kr.jipsee.api.common.YearMonthResponse;
import kr.jipsee.deal.dto.GroupDeal;

/** 건물 상세의 거래 한 건 응답. id는 {type}-{원본 id} 형식 */
public record BuildingDealResponse(
        String id,
        YearMonthResponse month,
        String type,
        String contract,
        BigDecimal exclusiveArea,
        int amount,
        Integer monthlyRent,
        boolean cancelled) {

    /** 이력 행을 응답으로 변환 */
    public static BuildingDealResponse from(GroupDeal deal) {
        return new BuildingDealResponse(
                deal.type().code() + "-" + deal.id(),
                YearMonthResponse.from(deal.month()),
                deal.type().code(),
                deal.contract() == null ? null : deal.contract().code(),
                deal.exclusiveArea(),
                deal.amount(),
                deal.monthlyRent(),
                deal.cancelled());
    }
}
