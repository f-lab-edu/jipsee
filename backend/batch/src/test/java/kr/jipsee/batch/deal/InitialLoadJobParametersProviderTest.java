package kr.jipsee.batch.deal;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.YearMonth;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.job.parameters.JobParameters;

class InitialLoadJobParametersProviderTest {

    InitialLoadJobParametersProvider provider =
            new InitialLoadJobParametersProvider("initialRentLoadJob", new DealBatchProperties(YearMonth.of(2026, 10)));

    @Test
    @DisplayName("Job 이름을 생성할 때 받은 값으로 반환함")
    void Job_이름을_생성할_때_받은_값으로_반환함() {
        assertThat(provider.jobName()).isEqualTo("initialRentLoadJob");
    }

    @Test
    @DisplayName("endMonth를 설정한 초기 적재 종료 월로 계산함")
    void endMonth를_설정한_초기_적재_종료_월로_계산함() {
        // when
        JobParameters parameters = provider.create();

        // then
        assertThat(parameters.getString("endMonth")).isEqualTo("2026-10");
        assertThat(parameters.parameters()).hasSize(1);
    }
}
