package kr.jipsee.deal.dto;

import java.math.BigDecimal;
import java.time.YearMonth;

/**
 * 주변 거래 조회 결과의 한 행
 * - houseName이 null이면 건물명을 지번 주소로 대체하며, 이때 sigunguCode, legalDongName, lotNumber를 사용
 */
public record NearbyDealRow(
        long id,
        DealType type,
        YearMonth month,
        ContractType contract,
        BigDecimal exclusiveArea,
        int amount,
        Integer monthlyRent,
        String houseName,
        String sigunguCode,
        String legalDongName,
        String lotNumber) {}
