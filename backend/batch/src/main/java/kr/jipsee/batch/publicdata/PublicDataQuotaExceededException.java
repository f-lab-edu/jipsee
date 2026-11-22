package kr.jipsee.batch.publicdata;

/** 하루 호출 한도 초과(오류 코드 22). 재시도하지 않고 다음 날 같은 파라미터로 이어서 실행 */
public class PublicDataQuotaExceededException extends PublicDataApiException {
    public PublicDataQuotaExceededException(String message) {
        super(message);
    }
}
