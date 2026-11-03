package kr.jipsee.global.core.exception.handler;

import kr.jipsee.global.core.exception.BusinessException;
import kr.jipsee.global.core.exception.ErrorCode;
import kr.jipsee.global.core.exception.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * 전역 예외 처리
 *
 * - 모든 오류를 ErrorResponse로 반환
 * - Spring MVC 기본 예외는 예외 타입과 HTTP 상태로 ErrorCode를 정함
 * - 매핑되지 않은 예외는 INTERNAL_ERROR로 반환하고 로그를 남김
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final String INTERNAL_ERROR_MESSAGE = "처리하지 못한 예외";

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception exception) {
        log.error(INTERNAL_ERROR_MESSAGE, exception);
        return ErrorResponse.of(ErrorCode.INTERNAL_ERROR);
    }

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleBusinessException(BusinessException exception) {
        return ErrorResponse.of(exception.getErrorCode());
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception exception, Object body, HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
        ErrorCode errorCode = toErrorCode(exception, statusCode);
        if (errorCode == ErrorCode.INTERNAL_ERROR) {
            log.error(INTERNAL_ERROR_MESSAGE, exception);
        }
        return super.handleExceptionInternal(
                exception, ErrorResponse.of(errorCode), headers, errorCode.getStatus(), request);
    }

    private ErrorCode toErrorCode(Exception exception, HttpStatusCode statusCode) {
        if (exception instanceof MethodArgumentNotValidException
                || exception instanceof HandlerMethodValidationException) {
            return ErrorCode.VALIDATION_FAILED;
        }

        return switch (HttpStatus.valueOf(statusCode.value())) {
            case BAD_REQUEST -> ErrorCode.INVALID_REQUEST;
            case NOT_FOUND -> ErrorCode.PATH_NOT_FOUND;
            case METHOD_NOT_ALLOWED -> ErrorCode.METHOD_NOT_ALLOWED;
            case NOT_ACCEPTABLE -> ErrorCode.NOT_ACCEPTABLE;
            case UNSUPPORTED_MEDIA_TYPE -> ErrorCode.UNSUPPORTED_MEDIA_TYPE;
            default -> ErrorCode.INTERNAL_ERROR;
        };
    }
}
