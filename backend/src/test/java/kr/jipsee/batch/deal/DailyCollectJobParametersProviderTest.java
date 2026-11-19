package kr.jipsee.batch.deal;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.job.parameters.JobParameters;

class DailyCollectJobParametersProviderTest {

    // 2027-01-01 04:00 KST. UTC 날짜는 2026-12-31이라 시간대 오류를 검출함
    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-12-31T19:00:00Z"), ZoneId.of("Asia/Seoul"));

    DailyCollectJobParametersProvider provider = new DailyCollectJobParametersProvider("dailyRentCollectJob", CLOCK);

    @Test
    @DisplayName("Job 이름을 생성할 때 받은 값으로 반환함")
    void Job_이름을_생성할_때_받은_값으로_반환함() {
        assertThat(provider.jobName()).isEqualTo("dailyRentCollectJob");
    }

    @Test
    @DisplayName("collectDate를 실행일(KST)로 계산함")
    void collectDate를_실행일_KST로_계산함() {
        // when
        JobParameters parameters = provider.create();

        // then
        assertThat(parameters.getString("collectDate")).isEqualTo("2027-01-01");
        assertThat(parameters.parameters()).hasSize(1);
    }
}
