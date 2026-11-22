package kr.jipsee.batch.deal;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.YearMonth;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DealJobParametersConfigTest {

    DealJobParametersConfig config = new DealJobParametersConfig();
    Clock clock = Clock.systemUTC();
    DealBatchProperties properties = new DealBatchProperties(YearMonth.of(2026, 10));

    @Test
    @DisplayName("Job마다 이름이 같은 파라미터 제공자를 만듦")
    void Job마다_이름이_같은_파라미터_제공자를_만듦() {
        assertThat(config.dailyRentJobParametersProvider(clock).jobName()).isEqualTo("dailyRentCollectJob");
        assertThat(config.dailySaleJobParametersProvider(clock).jobName()).isEqualTo("dailySaleCollectJob");
        assertThat(config.initialRentJobParametersProvider(properties).jobName())
                .isEqualTo("initialRentLoadJob");
        assertThat(config.initialSaleJobParametersProvider(properties).jobName())
                .isEqualTo("initialSaleLoadJob");
    }

    @Test
    @DisplayName("일일 Job은 collectDate, 초기 적재 Job은 endMonth를 계산함")
    void 일일_Job은_collectDate_초기_적재_Job은_endMonth를_계산함() {
        assertThat(config.dailySaleJobParametersProvider(clock).create().getString("collectDate"))
                .isNotNull();
        assertThat(config.initialSaleJobParametersProvider(properties).create().getString("endMonth"))
                .isEqualTo("2026-10");
    }
}
