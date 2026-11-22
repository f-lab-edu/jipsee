package kr.jipsee.batch.common;

import java.time.Clock;
import kr.jipsee.global.common.TimeZones;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/** 배치 스케줄링 설정 */
@Configuration
@EnableScheduling
public class SchedulingConfig {

    /** 수집 대상 월 계산. Asia/Seoul 기준 */
    @Bean
    Clock clock() {
        return Clock.system(TimeZones.SEOUL);
    }
}
