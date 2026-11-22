package kr.jipsee.batch.common;

import java.time.Clock;
import kr.jipsee.global.TimeZones;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** 수집 날짜와 수집 시각 계산에 쓰는 시계 설정 */
@Configuration
public class ClockConfig {

    /** Asia/Seoul 기준 시계 */
    @Bean
    Clock clock() {
        return Clock.system(TimeZones.SEOUL);
    }
}
