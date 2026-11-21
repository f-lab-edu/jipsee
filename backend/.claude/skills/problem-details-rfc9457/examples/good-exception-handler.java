// ✅ GOOD — one BusinessException + ErrorCode enum, one handler per kind, fixed detail strings, no title/instance/timestamp

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleBusinessException(BusinessException exception) {
        return toErrorResponse(exception.getErrorCode());   // ErrorKind -> HttpStatus is mapped in one place
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception exception) {
        log.error("처리하지 못한 예외", exception);   // log the cause, never return it
        return toErrorResponse(ErrorCode.INTERNAL_ERROR);
    }
}

// Adding an error = adding one constant. No new exception class, no new handler method.
//   ORDER_NOT_FOUND(ErrorKind.NOT_FOUND, "주문을 찾을 수 없습니다."),
//   throw new BusinessException(ErrorCode.ORDER_NOT_FOUND);   // from a core service when the target must exist
