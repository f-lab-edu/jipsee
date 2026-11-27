package kr.jipsee.deal.dto;

import java.time.YearMonth;

/** 건물 검색 결과 한 건. name과 latestNewJeonseMonth는 null일 수 있음 */
public record DealGroupSummary(BuildingKey key, String name, String lotAddress, YearMonth latestNewJeonseMonth) {}
