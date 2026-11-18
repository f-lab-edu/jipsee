package kr.jipsee.deal.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** 실거래 데이터 수집 후 sale_deal 테이블에 추가할 데이터 Row 하나 */
public record SaleDealRow(
        String sigunguCode,
        String legalDongName,
        String lotNumber,
        String houseName,
        Integer buildYear,
        BigDecimal exclusiveArea,
        Integer floor,
        LocalDate dealDate,
        int dealAmount,
        String cancellationType,
        LocalDate cancellationDate) {

    public Object[] toArray() {
        return new Object[] {
            sigunguCode,
            legalDongName,
            lotNumber,
            houseName,
            buildYear,
            exclusiveArea,
            floor,
            dealDate,
            dealAmount,
            cancellationType,
            cancellationDate
        };
    }
}
