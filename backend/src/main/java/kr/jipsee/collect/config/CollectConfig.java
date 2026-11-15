package kr.jipsee.collect.config;

import java.time.Clock;
import kr.jipsee.global.common.TimeZones;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

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
}
