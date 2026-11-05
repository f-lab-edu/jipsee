package kr.jipsee.deal.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** 실거래 데이터 수집 후 DB에 추가할 데이터 Row 하나 */
public record RentDealRow(
        String sigunguCode,
        String legalDongName,
        String lotNumber,
        String houseName,
        Integer buildYear,
        BigDecimal exclusiveArea,
        Integer floor,
        LocalDate dealDate,
        int deposit,
        int monthlyRent,
        Integer previousDeposit,
        Integer previousMonthlyRent,
        String contractTerm,
        String contractType,
        String renewalRightUsed) {

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
            deposit,
            monthlyRent,
            previousDeposit,
            previousMonthlyRent,
            contractTerm,
            contractType,
            renewalRightUsed
        };
    }
}
