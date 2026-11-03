package kr.jipsee.global.core.exception;

import lombok.Getter;

/**
 * 비즈니스 예외
 *
 * - 오류를 추가할 때 예외 클래스를 만들지 않고 ErrorCode 상수를 추가함
 */
@Getter
public class BusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getDetail());
        this.errorCode = errorCode;
    }
}
