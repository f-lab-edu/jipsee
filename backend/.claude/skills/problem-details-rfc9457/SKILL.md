---
name: problem-details-rfc9457
description: >
  Use when implementing error handling, exception mappers, or error response formatting.
  Enforces RFC 9457 (Problem Details for HTTP APIs) using Spring's built-in ProblemDetail.
---

# Problem Details — RFC 9457

Spring Boot 4 / Spring Framework 7 includes native RFC 9457 support via `ProblemDetail`.

The project has exactly one `@RestControllerAdvice`, `GlobalExceptionHandler` in the api module (`kr.jipsee.api.exception`),
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

Build every error body with `ErrorResponse.of(errorCode, httpStatus)`; the handler's `toErrorResponse(errorCode)` supplies the status. `ErrorResponse` extends `ProblemDetail` and adds a typed
`code` field (`ErrorCode`, serialized as the constant name). Spring fills `title` (reason phrase of the status) and
`instance` (request path). No `timestamp`, no custom `type` URI.

## Error Model

`BusinessException`, `ErrorCode`, and `ErrorKind` are in `core` (`kr.jipsee.global.exception`) and must not depend on spring-web.
`ErrorResponse` and `GlobalExceptionHandler` are in `api` (`kr.jipsee.api.exception`).
Templates: `templates/ErrorCode.java`, `templates/ErrorKind.java`, `templates/BusinessException.java`,
`templates/ErrorResponse.java`, `templates/GlobalExceptionHandler.java`.

```java
/** core: 오류 종류. HTTP 상태로의 변환은 api의 GlobalExceptionHandler가 함 */
public enum ErrorKind {
    INVALID,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    NOT_ACCEPTABLE,
    UNSUPPORTED_MEDIA_TYPE,
    INTERNAL
}

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    INTERNAL_ERROR(ErrorKind.INTERNAL, "예기치 못한 오류가 발생했습니다."),
    VALIDATION_FAILED(ErrorKind.INVALID, "입력값이 올바르지 않습니다."),
    INVALID_REQUEST(ErrorKind.INVALID, "요청 형식이 올바르지 않습니다."),
    PATH_NOT_FOUND(ErrorKind.NOT_FOUND, "요청한 주소를 찾을 수 없습니다."),
    METHOD_NOT_ALLOWED(ErrorKind.METHOD_NOT_ALLOWED, "지원하지 않는 요청 방식입니다."),
    NOT_ACCEPTABLE(ErrorKind.NOT_ACCEPTABLE, "지원하지 않는 응답 형식입니다."),
    UNSUPPORTED_MEDIA_TYPE(ErrorKind.UNSUPPORTED_MEDIA_TYPE, "지원하지 않는 요청 본문 형식입니다."),
    ORDER_NOT_FOUND(ErrorKind.NOT_FOUND, "주문을 찾을 수 없습니다.");

    private final ErrorKind kind;
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
```

`BusinessException` is the only custom exception and extends `RuntimeException` directly (no abstract base).
Which layer throws it:

- A `core` service throws `BusinessException(ErrorCode.X_NOT_FOUND)` when the lookup target must exist (detail, update, delete by id).
- A `core` service returns `Optional` (or an empty result) only where an empty result is a legitimate answer (search, batch lookups).
- A violated invariant is `IllegalStateException`, which the handler maps to 500 `INTERNAL_ERROR`.
- Request validation (400) is done by the api controller.

```java
// core service: the target must exist
public OrderSummary findById(Long id) {
    return orderRepository.findById(id)
        .map(OrderSummary::from)
        .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));
}
```

Adding an error means adding one `ErrorCode` constant (with an existing `ErrorKind`). A new `ErrorKind` constant needs a case in the handler's `toHttpStatus`.
No new exception class, no new handler method.

`detail` is a fixed, user-facing Korean sentence in polite form ending in `~습니다.`. Never put `ex.getMessage()` or
internal information in the response.

## Global Exception Handler

Package `kr.jipsee.api.exception`. Template: `templates/GlobalExceptionHandler.java`.

```java
/**
 * 전역 예외 처리
 *
 * - 모든 오류를 ErrorResponse로 반환
 * - Spring MVC 기본 예외는 예외 타입과 HTTP 상태로 ErrorCode를 정함
 * - ErrorCode의 ErrorKind를 HTTP 상태로 바꾸는 곳은 이 클래스 한 곳임
 * - 매핑되지 않은 예외는 INTERNAL_ERROR로 반환하고 로깅
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final String INTERNAL_ERROR_MESSAGE = "처리하지 못한 예외";

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
- Agent puts `HttpStatus` (spring-web) in `ErrorCode` or imports it in `core`: `core` has no spring-web. Use `ErrorKind` and map it in the api handler
- Agent adds a new `@ExceptionHandler` per error — `handleBusinessException` already maps every `ErrorCode`
- Agent builds an abstract base exception (`DomainException`) or subclasses `BusinessException` — keep it a single concrete class extending `RuntimeException`
- Agent exposes raw exception messages in error responses — `detail` is the fixed `ErrorCode` string; log the exception instead
- Agent returns `Map<String, Object>` for errors — use `ProblemDetail`
- Agent uses custom error envelope alongside ProblemDetail — pick one standard
- Agent sets `title`, `instance`, `timestamp`, or a `type` URI — Spring fills `title` and `instance`; the rest is not part of the contract
- Agent builds `ProblemDetail` directly or calls `setProperty("code", ...)`: use `ErrorResponse.of(errorCode, httpStatus)` through the handler's `toErrorResponse`
- Agent adds `@ExceptionHandler` methods for Spring MVC exceptions (validation, 404, 405, unreadable body) — `handleExceptionInternal` already maps them; add a case to `toErrorCode` instead
- Agent returns 200 with error in body — always use the correct HTTP status code
- Agent creates handler without extending `ResponseEntityExceptionHandler` — extend it to get Spring's built-in exception handling for free
- Agent writes English or non-polite `detail` strings — Korean polite form ending in `~습니다.`
