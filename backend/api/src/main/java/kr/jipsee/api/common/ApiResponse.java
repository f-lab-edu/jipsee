package kr.jipsee.api.common;

/** 성공 응답 본문, data 필드로 감싼 형태 */
public record ApiResponse<T>(T data) {

    /** 값을 data 필드로 감싼 응답 생성 */
    public static <T> ApiResponse<T> of(T data) {
        return new ApiResponse<>(data);
    }
}
