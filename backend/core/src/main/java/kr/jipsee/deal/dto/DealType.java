package kr.jipsee.deal.dto;

import java.util.Arrays;

/** 거래 유형. 전세, 월세, 매매 */
public enum DealType {
    JEONSE("jeonse"),
    WOLSE("wolse"),
    SALE("sale");

    private final String code;

    DealType(String code) {
        this.code = code;
    }

    /** 응답과 조회에 쓰는 코드 문자열 */
    public String code() {
        return code;
    }

    /** 코드 문자열로 거래 유형 조회. 알 수 없는 코드는 IllegalArgumentException */
    public static DealType fromCode(String code) {
        return Arrays.stream(values())
                .filter(type -> type.code.equals(code))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("알 수 없는 거래 유형: " + code));
    }
}
