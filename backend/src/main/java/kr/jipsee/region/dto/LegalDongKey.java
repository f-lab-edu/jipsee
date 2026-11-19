package kr.jipsee.region.dto;

/** 법정동을 식별하는 시군구 코드와 법정동 코드 */
public record LegalDongKey(String sigunguCode, String legalDongCode) {

    /** 두 값을 이은 10자리 법정동 코드 반환 */
    public String code() {
        return sigunguCode + legalDongCode;
    }
}
