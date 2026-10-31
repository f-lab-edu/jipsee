---
name: problem-details-rfc9457
description: >
  Use when implementing error handling, exception mappers, or error response formatting.
  Enforces RFC 9457 (Problem Details for HTTP APIs) using Spring's built-in ProblemDetail.
---

# Problem Details — RFC 9457

Spring Boot 4 / Spring Framework 7 includes native RFC 9457 support via `ProblemDetail`.

The project has exactly one `@RestControllerAdvice`, `GlobalExceptionHandler` in `kr.jipsee.global`,
extending `ResponseEntityExceptionHandler`. It already converts Spring's own MVC exceptions to
`ProblemDetail`, so no `spring.mvc.problemdetails.enabled` setting is needed.

## ProblemDetail Response Shape

```json
{
  "type": "about:blank",
  "title": "Order Not Found",
  "status": 404,
  "detail": "Order not found",
  "instance": "/orders/123",
  "timestamp": "2026-04-13T10:00:00Z"
}
```

`type` defaults to `about:blank`; set it only when you publish documentation for the error type.

## Global Exception Handler

Template: `templates/GlobalExceptionHandler.java`.

```java
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(OrderNotFoundException.class)
    public ProblemDetail handleOrderNotFound(OrderNotFoundException ex, HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, "Order not found");
        problem.setTitle("Order Not Found");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex, HttpHeaders headers,
        HttpStatusCode status, WebRequest request
    ) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "Request validation failed");
        problem.setTitle("Validation Failed");
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("violations", ex.getBindingResult().getFieldErrors().stream()
            .map(e -> Map.of("field", e.getField(),
                "message", Objects.toString(e.getDefaultMessage(), "")))
            .toList());
        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneric(Exception ex, HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
        problem.setTitle("Internal Server Error");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("timestamp", Instant.now());
        // Don't expose ex.getMessage() — log it instead
        log.error("Unhandled exception at {}", request.getRequestURI(), ex);
        return problem;
    }
}
```

Never put an exception message in `detail`. Use a fixed string per handler.

## Custom Domain Exceptions

Flat: extend `RuntimeException` directly. No abstract base class, no `errorCode` or `httpStatus` fields.
The status is mapped in `GlobalExceptionHandler`. Domain exceptions live in `kr.jipsee.<domain>.domain`.

```java
// kr.jipsee.order.domain
public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(Long id) {
        super("Order not found: " + id);
    }
}
```

The message is for logs only. Add one `@ExceptionHandler` per exception in the advice, as above.

## Content Negotiation

Clients can request problem details explicitly with `Accept: application/problem+json`. Your handler returns `ProblemDetail` and Spring sets the correct `Content-Type: application/problem+json`.

## Success vs Error

Success returns the body directly; errors return `ProblemDetail`.

## Gotchas
- Agent assumes `ResponseEntityExceptionHandler` covers everything — it only converts *Spring's own* MVC exceptions; your domain exceptions still need `@ExceptionHandler` methods
- Agent returns `Map<String, Object>` for errors — use `ProblemDetail`
- Agent exposes raw exception messages in error responses — use fixed detail strings; log the exception instead
- Agent uses custom error envelope alongside ProblemDetail — pick one standard
- Agent invents `type` URIs on a made-up domain — `type` defaults to `about:blank`; set it only for documented error types
- Agent returns 200 with error in body — always use the correct HTTP status code
- Agent creates handler without extending `ResponseEntityExceptionHandler` — extend it to get Spring's built-in exception handling for free
- Agent builds a `DomainException` base class with `errorCode`/`httpStatus` — keep exceptions flat and map status in the advice
- Agent calls `Map.of(..., e.getDefaultMessage())` for violations — `getDefaultMessage()` can be null and `Map.of` throws; wrap with `Objects.toString(..., "")`
