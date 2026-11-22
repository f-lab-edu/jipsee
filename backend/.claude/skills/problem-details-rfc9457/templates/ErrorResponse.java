package kr.jipsee.api.exception;

import kr.jipsee.global.exception.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

/**
 * 오류 응답
 *
 * - RFC 9457 ProblemDetail에 code (에러 코드) 속성 추가
 */
@Getter
public class ErrorResponse extends ProblemDetail {
    private final ErrorCode code;

    private ErrorResponse(ErrorCode errorCode, HttpStatus status) {
        super(status.value());
        setDetail(errorCode.getDetail());
        this.code = errorCode;
    }

    /** HTTP 상태와 ErrorCode의 detail, 상수 이름으로 오류 응답 생성 */
    public static ErrorResponse of(ErrorCode errorCode, HttpStatus status) {
        return new ErrorResponse(errorCode, status);
    }
}
