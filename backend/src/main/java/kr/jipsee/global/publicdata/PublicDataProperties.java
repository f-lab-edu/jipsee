package kr.jipsee.global.publicdata;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** jipsee.public-data 설정 */
@ConfigurationProperties("jipsee.public-data")
public record PublicDataProperties(Api api) {

    /** 공공데이터 API 기준 주소와 인코딩된 서비스 키 */
    public record Api(String baseUrl, String serviceKey) {
        /** 로그에 서비스 키가 남지 않도록 처리 */
        @Override
        public String toString() {
            return "Api[baseUrl=" + baseUrl + ", serviceKey=***]";
        }
    }
}
