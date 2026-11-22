package kr.jipsee.batch.publicdata;

import java.time.Duration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/** 공공데이터 API 호출 설정 */
@Configuration
@EnableConfigurationProperties(PublicDataProperties.class)
public class PublicDataConfig {

    /** 연결 5초, 읽기 30초 제한. 기준 주소는 설정값 */
    @Bean
    RestClient publicDataRestClient(PublicDataProperties properties) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(30));

        return PublicDataApiClient.restClient(
                RestClient.builder().requestFactory(factory), properties.api().baseUrl());
    }

    /** 재시도는 2초에서부터 시작 */
    @Bean
    RetryTemplate publicDataRetryTemplate() {
        return PublicDataApiClient.retryTemplate(Duration.ofSeconds(2));
    }
}
