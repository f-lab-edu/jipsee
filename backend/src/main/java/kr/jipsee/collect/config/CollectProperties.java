package kr.jipsee.collect.config;

import java.time.YearMonth;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** jipsee.collect 설정. 초기 적재 종료 월을 바꾸면 적재를 처음부터 다시 시작 */
@ConfigurationProperties("jipsee.collect")
public record CollectProperties(Api api, YearMonth initialLoadEndMonth) {

    /** 공공데이터 API 기준 주소와 인코딩된 서비스 키 */
    public record Api(String baseUrl, String serviceKey) {
        /** 로그에 서비스 키가 남지 않도록 처리 */
        @Override
        public String toString() {
            return "Api[baseUrl=" + baseUrl + ", serviceKey=***]";
        }
    }
}
