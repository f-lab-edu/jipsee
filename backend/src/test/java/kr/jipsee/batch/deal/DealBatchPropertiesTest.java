package kr.jipsee.batch.deal;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.YearMonth;
import kr.jipsee.TestcontainersConfiguration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class DealBatchPropertiesTest {

    @Autowired
    DealBatchProperties properties;

    @Autowired
    Environment environment;

    @Test
    @DisplayName("초기 적재 종료 월을 새 키에서 읽음")
    void 초기_적재_종료_월을_새_키에서_읽음() {
        assertThat(properties.initialLoadEndMonth()).isEqualTo(YearMonth.of(2026, 10));
    }

    @Test
    @DisplayName("옛 설정 키는 남지 않음")
    void 옛_설정_키는_남지_않음() {
        assertThat(environment.getProperty("jipsee.collect.initial-load-end-month"))
                .isNull();
    }
}
