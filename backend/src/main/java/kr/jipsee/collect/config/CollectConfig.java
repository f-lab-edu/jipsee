package kr.jipsee.collect.config;

import java.time.Clock;
import java.time.Duration;
import kr.jipsee.collect.client.RtmsApiClient;
import kr.jipsee.global.common.TimeZones;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestClient;

/** 데이터 수집 설정 */
@Configuration
@EnableScheduling
@EnableConfigurationProperties(CollectProperties.class)
public class CollectConfig {

    /** 수집 대상 월 계산. Asia/Seoul 기준 */
    @Bean
    Clock clock() {
        return Clock.system(TimeZones.SEOUL);
    }

    /** 연결 5초, 읽기 30초 제한. 기준 주소는 설정값 */
    @Bean
    RestClient rtmsRestClient(CollectProperties properties) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(30));

        return RtmsApiClient.restClient(
                RestClient.builder().requestFactory(factory), properties.api().baseUrl());
    }

    /** 재시도는 2초에서부터 시작 */
    @Bean
    RetryTemplate rtmsRetryTemplate() {
        return RtmsApiClient.retryTemplate(Duration.ofSeconds(2));
    }
}
