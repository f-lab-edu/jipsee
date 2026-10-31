package kr.jipsee.global.core.exception.handler;

import kr.jipsee.global.core.exception.BusinessException;
import kr.jipsee.global.core.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // detail is the fixed ErrorCode string; title and instance are filled by Spring
    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleBusinessException(BusinessException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        return ProblemDetail.forStatusAndDetail(errorCode.getStatus(), errorCode.getDetail());
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception exception) {
        log.error("처리하지 못한 예외", exception);
        ErrorCode errorCode = ErrorCode.INTERNAL_ERROR;
        return ProblemDetail.forStatusAndDetail(errorCode.getStatus(), errorCode.getDetail());
    }
}
