package kr.jipsee.collect.exception;

/**
 * 4xx, 하루 호출 한도 초과, 응답 형식 이상
 */
public class DealApiException extends RuntimeException {
    public DealApiException(String message) {
        super(message);
    }
}
