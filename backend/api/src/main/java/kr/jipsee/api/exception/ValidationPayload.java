package kr.jipsee.api.exception;

import jakarta.validation.Payload;

/**
 * 요청 검사 실패의 ErrorCode 표식
 *
 * - 제약의 payload에 지정하면 GlobalExceptionHandler가 해당 ErrorCode로 응답
 * - ErrorCode 연결은 GlobalExceptionHandler의 PAYLOAD_ERROR_CODES 한 곳에서 관리
 */
public final class ValidationPayload {

    private ValidationPayload() {}

    /** INVALID_REQUEST */
    public interface InvalidRequest extends Payload {}

    /** KEYWORD_TOO_SHORT */
    public interface KeywordTooShort extends Payload {}
}
