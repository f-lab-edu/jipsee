package kr.jipsee.global.core.exception;

import lombok.Getter;
import org.springframework.http.ProblemDetail;

/**
 * 오류 응답
 *
 * - RFC 9457 ProblemDetail에 code (에러 코드) 속성 추가
 */
@Getter
public class ErrorResponse extends ProblemDetail {
    private final ErrorCode code;

    private ErrorResponse(ErrorCode errorCode) {
        super(errorCode.getStatus().value());
        setDetail(errorCode.getDetail());
        this.code = errorCode;
    }

    /** ErrorCode의 상태, detail, 상수 이름으로 오류 응답 생성 */
    public static ErrorResponse of(ErrorCode errorCode) {
        return new ErrorResponse(errorCode);
    }
}
