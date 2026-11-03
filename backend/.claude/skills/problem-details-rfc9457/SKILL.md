---
name: problem-details-rfc9457
description: >
  Use when implementing error handling, exception mappers, or error response formatting.
  Enforces RFC 9457 (Problem Details for HTTP APIs) using Spring's built-in ProblemDetail.
---

# Problem Details — RFC 9457

Spring Boot 4 / Spring Framework 7 includes native RFC 9457 support via `ProblemDetail`.

The project has exactly one `@RestControllerAdvice`, `GlobalExceptionHandler` in `kr.jipsee.global.core.exception.handler`,
extending `ResponseEntityExceptionHandler`. Spring's own MVC exceptions (validation, 404, 405, 415, unreadable body) all go
through `handleExceptionInternal`, which the handler overrides to map them to an `ErrorCode` by exception type and status.
No `spring.mvc.problemdetails.enabled` setting is needed. Do not add `@ExceptionHandler` methods for them.

## ProblemDetail Response Shape

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "주문을 찾을 수 없습니다.",
  "instance": "/orders/123",
  "code": "ORDER_NOT_FOUND"
}
```

Build every error body with `ErrorResponse.of(errorCode)`. `ErrorResponse` extends `ProblemDetail` and adds a typed
`code` field (`ErrorCode`, serialized as the constant name). Spring fills `title` (reason phrase of the status) and
`instance` (request path). No `timestamp`, no custom `type` URI.

## Error Model

Package `kr.jipsee.global.core.exception`. Templates: `templates/ErrorCode.java`, `templates/ErrorResponse.java`,
`templates/BusinessException.java`, `templates/GlobalExceptionHandler.java`.

```java
@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "예기치 못한 오류가 발생했습니다."),
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다."),
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "요청 형식이 올바르지 않습니다."),
    PATH_NOT_FOUND(HttpStatus.NOT_FOUND, "요청한 주소를 찾을 수 없습니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "지원하지 않는 요청 방식입니다."),
    NOT_ACCEPTABLE(HttpStatus.NOT_ACCEPTABLE, "지원하지 않는 응답 형식입니다."),
    UNSUPPORTED_MEDIA_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "지원하지 않는 요청 본문 형식입니다."),
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "주문을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String detail;
}

@Getter
public class BusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getDetail());
        this.errorCode = errorCode;
    }
}

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
```

`BusinessException` is the only custom exception and extends `RuntimeException` directly (no abstract base).
Throw it from the domain or service layer:

```java
throw new BusinessException(ErrorCode.ORDER_NOT_FOUND);
```

Adding an error means adding one `ErrorCode` constant. No new exception class, no new handler method.

`detail` is a fixed, user-facing Korean sentence in polite form ending in `~습니다.`. Never put `ex.getMessage()` or
internal information in the response.

## Global Exception Handler

Package `kr.jipsee.global.core.exception.handler`. Template: `templates/GlobalExceptionHandler.java`.

```java
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
```

## Content Negotiation

Clients can request problem details explicitly with `Accept: application/problem+json`. Your handler returns `ProblemDetail` and Spring sets the correct `Content-Type: application/problem+json`.

## Success vs Error

Success returns the body directly; errors return `ProblemDetail`.

## Gotchas
- Agent creates a new exception class per error (`OrderNotFoundException`) — add an `ErrorCode` constant and throw `BusinessException`
- Agent adds a new `@ExceptionHandler` per error — `handleBusinessException` already maps every `ErrorCode`
- Agent builds an abstract base exception (`DomainException`) or subclasses `BusinessException` — keep it a single concrete class extending `RuntimeException`
- Agent exposes raw exception messages in error responses — `detail` is the fixed `ErrorCode` string; log the exception instead
- Agent returns `Map<String, Object>` for errors — use `ProblemDetail`
- Agent uses custom error envelope alongside ProblemDetail — pick one standard
- Agent sets `title`, `instance`, `timestamp`, or a `type` URI — Spring fills `title` and `instance`; the rest is not part of the contract
- Agent builds `ProblemDetail` directly or calls `setProperty("code", ...)` — use `ErrorResponse.of(errorCode)`
- Agent adds `@ExceptionHandler` methods for Spring MVC exceptions (validation, 404, 405, unreadable body) — `handleExceptionInternal` already maps them; add a case to `toErrorCode` instead
- Agent returns 200 with error in body — always use the correct HTTP status code
- Agent creates handler without extending `ResponseEntityExceptionHandler` — extend it to get Spring's built-in exception handling for free
- Agent writes English or non-polite `detail` strings — Korean polite form ending in `~습니다.`
