---
name: problem-details-rfc9457
description: >
  Use when implementing error handling, exception mappers, or error response formatting.
  Enforces RFC 9457 (Problem Details for HTTP APIs) using Spring's built-in ProblemDetail.
---

# Problem Details — RFC 9457

Spring Boot 4 / Spring Framework 7 includes native RFC 9457 support via `ProblemDetail`.

The project has exactly one `@RestControllerAdvice`, `GlobalExceptionHandler` in `kr.jipsee.global.core.exception.handler`,
extending `ResponseEntityExceptionHandler`. It already converts Spring's own MVC exceptions (validation, 404 no handler, 405,
unreadable body) to `ProblemDetail`, so no `spring.mvc.problemdetails.enabled` setting is needed. Do not add handlers for them.

## ProblemDetail Response Shape

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "주문을 찾을 수 없습니다.",
  "instance": "/orders/123"
}
```

Set only `status` and `detail` in code. Spring fills `title` (reason phrase of the status) and `instance` (request path).
No `timestamp`, no custom `type` URI, no error code property in the body.

## Error Model

Package `kr.jipsee.global.core.exception`. Templates: `templates/ErrorCode.java`, `templates/BusinessException.java`,
`templates/GlobalExceptionHandler.java`.

```java
@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "예기치 못한 오류가 발생했습니다."),
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
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

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
- Agent sets `title`, `instance`, `timestamp`, a `type` URI, or an error code property — Spring fills `title` and `instance`; the rest is not part of the contract
- Agent adds handlers or customization for validation, 404, 405 or unreadable body — `ResponseEntityExceptionHandler` already returns `ProblemDetail` for them
- Agent returns 200 with error in body — always use the correct HTTP status code
- Agent creates handler without extending `ResponseEntityExceptionHandler` — extend it to get Spring's built-in exception handling for free
- Agent writes English or non-polite `detail` strings — Korean polite form ending in `~습니다.`
