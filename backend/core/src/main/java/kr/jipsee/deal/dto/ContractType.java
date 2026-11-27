package kr.jipsee.deal.dto;

import java.util.Arrays;

/** 계약 구분. 신규, 갱신 */
public enum ContractType {
    NEW("new"),
    RENEWAL("renewal");

    private final String code;

    ContractType(String code) {
        this.code = code;
    }

    /** 응답에 쓰는 코드 문자열 */
    public String code() {
        return code;
    }

    /** 코드 문자열로 계약 구분 조회. null은 null, 알 수 없는 코드는 IllegalArgumentException */
    public static ContractType fromCode(String code) {
        if (code == null) {
            return null;
        }

        return Arrays.stream(values())
                .filter(type -> type.code.equals(code))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("알 수 없는 계약 구분: " + code));
    }
}
