package kr.jipsee.collect.exception;

/**
 * 공공데이터 연결 실패, 타임아웃, 5xx 에러, 초당 요청 수 초과 등
 */
public class RtmsApiTransientException extends RtmsApiException {
    public RtmsApiTransientException(String message) {
        super(message);
    }
}
