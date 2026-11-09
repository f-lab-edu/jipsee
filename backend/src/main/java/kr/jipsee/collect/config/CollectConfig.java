package kr.jipsee.collect.config;

import java.time.Clock;
import java.time.Duration;
import kr.jipsee.collect.client.DealApiCaller;
import kr.jipsee.global.common.TimeZones;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.json.JsonMapper;

/** 데이터 수집 설정 */
@Configuration
@EnableConfigurationProperties(CollectProperties.class)
public class CollectConfig {

    /** 수집 대상 월 계산. Asia/Seoul 기준 */
    @Bean
    Clock clock() {
        return Clock.system(TimeZones.SEOUL);
    }

    /** 연결 5초, 읽기 30초 제한. 재시도는 2초에서부터 시작 */
    @Bean
    DealApiCaller dealApiCaller(CollectProperties properties, JsonMapper jsonMapper) {

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(30));

        return new DealApiCaller(
                RestClient.builder().requestFactory(factory),
                properties.api().baseUrl(),
                properties.api().serviceKey(),
                Duration.ofSeconds(2),
                jsonMapper);
    }
}
