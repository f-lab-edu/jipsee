package kr.jipsee.collect.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.YearMonth;
import java.time.ZoneId;
import kr.jipsee.TestcontainersConfiguration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class CollectConfigTest {

    @Autowired
    CollectProperties properties;

    @Autowired
    Clock clock;

    @Test
    @DisplayName("수집 설정 값을 읽음")
    void 수집_설정_값을_읽음() {
        assertThat(properties.initialLoadEndMonth()).isEqualTo(YearMonth.of(2026, 10));
    }

    @Test
    @DisplayName("수집 날짜 계산에 쓰는 시계는 Asia/Seoul 시간대임")
    void 수집_날짜_계산에_쓰는_시계는_Asia_Seoul_시간대임() {
        assertThat(clock.getZone()).isEqualTo(ZoneId.of("Asia/Seoul"));
    }
}
