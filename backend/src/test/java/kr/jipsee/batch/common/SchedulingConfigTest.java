package kr.jipsee.batch.common;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.ZoneId;
import kr.jipsee.TestcontainersConfiguration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.config.TaskManagementConfigUtils;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class SchedulingConfigTest {

    @Autowired
    Clock clock;

    @Autowired
    ApplicationContext context;

    @Test
    @DisplayName("수집 날짜 계산에 쓰는 시계는 Asia/Seoul 시간대임")
    void 수집_날짜_계산에_쓰는_시계는_Asia_Seoul_시간대임() {
        assertThat(clock.getZone()).isEqualTo(ZoneId.of("Asia/Seoul"));
    }

    @Test
    @DisplayName("스케줄링이 켜져 있음")
    void 스케줄링이_켜져_있음() {
        assertThat(context.containsBean(TaskManagementConfigUtils.SCHEDULED_ANNOTATION_PROCESSOR_BEAN_NAME))
                .isTrue();
    }
}
