package kr.jipsee.deal.dto;

import java.time.YearMonth;

/** 데이터 출처별 기준 월 */
public record DataSourceStatus(String source, YearMonth baseMonth) {}
