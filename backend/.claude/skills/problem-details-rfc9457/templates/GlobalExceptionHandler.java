package kr.jipsee.api.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Payload;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import kr.jipsee.global.exception.BusinessException;
import kr.jipsee.global.exception.ErrorCode;
import kr.jipsee.global.exception.ErrorKind;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
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
 * - 요청 DTO 검사 실패(MethodArgumentNotValidException)는 첫 오류의 제약 payload(ValidationPayload)로 ErrorCode를 정함
 * - ErrorCode의 ErrorKind를 HTTP 상태로 바꾸는 곳은 이 클래스 한 곳임
 * - 매핑되지 않은 예외는 INTERNAL_ERROR로 반환하고 로깅
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final String INTERNAL_ERROR_MESSAGE = "처리하지 못한 예외";

    private static final Map<Class<? extends Payload>, ErrorCode> PAYLOAD_ERROR_CODES = Map.of(
            ValidationPayload.InvalidRequest.class, ErrorCode.INVALID_REQUEST,
            ValidationPayload.KeywordTooShort.class, ErrorCode.KEYWORD_TOO_SHORT);

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception exception) {
        log.error(INTERNAL_ERROR_MESSAGE, exception);
        return toErrorResponse(ErrorCode.INTERNAL_ERROR);
    }

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleBusinessException(BusinessException exception) {
        return toErrorResponse(exception.getErrorCode());
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception exception, Object body, HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
        ErrorCode errorCode = toErrorCode(exception, statusCode);
        if (errorCode == ErrorCode.INTERNAL_ERROR) {
            log.error(INTERNAL_ERROR_MESSAGE, exception);
        }
        ErrorResponse response = toErrorResponse(errorCode);
        return super.handleExceptionInternal(
                exception, response, headers, HttpStatusCode.valueOf(response.getStatus()), request);
    }

    private ErrorResponse toErrorResponse(ErrorCode errorCode) {
        return ErrorResponse.of(errorCode, toHttpStatus(errorCode.getKind()));
    }

    private HttpStatus toHttpStatus(ErrorKind kind) {
        return switch (kind) {
            case INVALID -> HttpStatus.BAD_REQUEST;
            case NOT_FOUND -> HttpStatus.NOT_FOUND;
            case METHOD_NOT_ALLOWED -> HttpStatus.METHOD_NOT_ALLOWED;
            case NOT_ACCEPTABLE -> HttpStatus.NOT_ACCEPTABLE;
            case UNSUPPORTED_MEDIA_TYPE -> HttpStatus.UNSUPPORTED_MEDIA_TYPE;
            case INTERNAL -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }

    private ErrorCode toErrorCode(Exception exception, HttpStatusCode statusCode) {
        if (exception instanceof MethodArgumentNotValidException notValid) {
            return toValidationErrorCode(notValid.getAllErrors());
        }
        if (exception instanceof HandlerMethodValidationException) {
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

    /** 첫 오류 기준. 타입 불일치는 INVALID_REQUEST, 제약 payload에 매핑된 ErrorCode, 그 외는 VALIDATION_FAILED */
    private ErrorCode toValidationErrorCode(List<? extends MessageSourceResolvable> errors) {
        if (errors.isEmpty()) {
            return ErrorCode.VALIDATION_FAILED;
        }
        MessageSourceResolvable first = errors.getFirst();
        if (first instanceof FieldError fieldError && fieldError.isBindingFailure()) {
            return ErrorCode.INVALID_REQUEST;
        }
        if (first instanceof ObjectError objectError && objectError.contains(ConstraintViolation.class)) {
            return toPayloadErrorCode(objectError.unwrap(ConstraintViolation.class));
        }
        return ErrorCode.VALIDATION_FAILED;
    }

    private ErrorCode toPayloadErrorCode(ConstraintViolation<?> violation) {
        return violation.getConstraintDescriptor().getPayload().stream()
                .map(PAYLOAD_ERROR_CODES::get)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(ErrorCode.VALIDATION_FAILED);
    }
}
