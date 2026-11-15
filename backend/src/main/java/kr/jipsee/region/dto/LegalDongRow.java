package kr.jipsee.region.dto;

/** 법정동 CSV의 한 행. 시도나 시군구 행이면 하위 이름은 빈 문자열 */
public record LegalDongRow(String code, String sidoName, String sigunguName, String eupMyeonDongName, String riName) {}
