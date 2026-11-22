package kr.jipsee.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 오류 코드
 *
 * - 상수 이름을 응답의 code로 반환
 * - kind는 오류의 종류이며 HTTP 상태는 api가 정함
 * - detail은 사용자에게 보여주는 고정 문장
 */
@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    INTERNAL_ERROR(ErrorKind.INTERNAL, "예기치 못한 오류가 발생했습니다."),
    VALIDATION_FAILED(ErrorKind.INVALID, "입력값이 올바르지 않습니다."),
    INVALID_REQUEST(ErrorKind.INVALID, "요청 형식이 올바르지 않습니다."),
    PATH_NOT_FOUND(ErrorKind.NOT_FOUND, "요청한 주소를 찾을 수 없습니다."),
    METHOD_NOT_ALLOWED(ErrorKind.METHOD_NOT_ALLOWED, "지원하지 않는 요청 방식입니다."),
    NOT_ACCEPTABLE(ErrorKind.NOT_ACCEPTABLE, "지원하지 않는 응답 형식입니다."),
    UNSUPPORTED_MEDIA_TYPE(ErrorKind.UNSUPPORTED_MEDIA_TYPE, "지원하지 않는 요청 본문 형식입니다.");

    private final ErrorKind kind;
    private final String detail;
}
