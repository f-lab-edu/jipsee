package kr.jipsee.deal.dto;

import java.math.BigDecimal;
import java.time.YearMonth;

/** 건물명 대체를 마친 주변 거래 한 건 */
public record NearbyDealItem(
        long id,
        String type,
        String buildingName,
        YearMonth month,
        String contract,
        BigDecimal exclusiveArea,
        int amount,
        Integer monthlyRent) {}
