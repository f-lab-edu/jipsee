package kr.jipsee.matching.dto;

/** 거래의 매칭 결과. ESTIMATED는 1단계에서 만들지 않음 */
public enum MatchStatus {
    CONFIRMED,
    PREVIOUS,
    FAILED
}
