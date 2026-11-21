package kr.jipsee.global.exception;

/**
 * 오류 종류
 *
 * - HTTP 상태로의 변환은 api의 GlobalExceptionHandler가 함
 */
public enum ErrorKind {
    INVALID,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    NOT_ACCEPTABLE,
    UNSUPPORTED_MEDIA_TYPE,
    INTERNAL
}
