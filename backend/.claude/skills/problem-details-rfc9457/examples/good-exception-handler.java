// ✅ GOOD — one BusinessException + ErrorCode enum, one handler per kind, fixed detail strings, no title/instance/timestamp

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
        log.error("처리하지 못한 예외", exception);   // log the cause, never return it
        ErrorCode errorCode = ErrorCode.INTERNAL_ERROR;
        return ProblemDetail.forStatusAndDetail(errorCode.getStatus(), errorCode.getDetail());
    }
}

// Adding an error = adding one constant. No new exception class, no new handler method.
//   ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "주문을 찾을 수 없습니다."),
//   throw new BusinessException(ErrorCode.ORDER_NOT_FOUND);
