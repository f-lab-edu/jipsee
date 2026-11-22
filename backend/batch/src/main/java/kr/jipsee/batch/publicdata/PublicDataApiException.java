package kr.jipsee.batch.publicdata;

/**
 * 4xx, 하루 호출 한도 초과, 응답 형식 이상
 */
public class PublicDataApiException extends RuntimeException {
    public PublicDataApiException(String message) {
        super(message);
    }
}
