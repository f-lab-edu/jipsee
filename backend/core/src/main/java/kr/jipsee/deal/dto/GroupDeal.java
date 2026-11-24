package kr.jipsee.deal.dto;

import java.math.BigDecimal;
import java.time.YearMonth;

/** 건물 이력의 한 행 */
public record GroupDeal(
        long id,
        YearMonth month,
        DealType type,
        ContractType contract,
        BigDecimal exclusiveArea,
        int amount,
        Integer monthlyRent,
        boolean cancelled) {}
