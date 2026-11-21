package kr.jipsee.matching.dto;

/** 거래 하나의 매칭 결과. FAILED이면 필지 ID가 null */
public record DealMatchResult(long id, Long buildingParcelId, MatchStatus status) {}
