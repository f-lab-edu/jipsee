package kr.jipsee.matching.dto;

/** 매칭할 거래 하나. 지번과 건축연도는 비어 있을 수 있어 null 가능 */
public record DealMatchTarget(long id, String sigunguCode, String legalDongName, String lotNumber, Integer buildYear) {}
