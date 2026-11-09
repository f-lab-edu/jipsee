package kr.jipsee.collect.dto;

import java.time.YearMonth;

/**
 * 거래 내역 수집 조건
 * - 특정 연월의 특정 시군구의 거래 내역 수집
 * - ex) 서울특별시 종로구, 2026년 10월
 * @param sigunguCode 시군구 코드
 * @param dealMonth 연월
 */
public record DealKey(String sigunguCode, YearMonth dealMonth) {}
