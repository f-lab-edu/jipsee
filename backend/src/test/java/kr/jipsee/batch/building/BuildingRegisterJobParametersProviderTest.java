package kr.jipsee.batch.building;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import kr.jipsee.batch.common.CollectStatusRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.core.job.parameters.JobParameters;

@ExtendWith(MockitoExtension.class)
class BuildingRegisterJobParametersProviderTest {

    @Mock
    CollectStatusRepository collectStatusRepository;

    // 실행 시각은 UTC로 지정함. KST는 9시간 빠르므로 UTC 날짜와 KST 날짜가 다른 시각이 시간대 오류를 검출함
    private JobParameters createAt(String instant) {
        Clock clock = Clock.fixed(Instant.parse(instant), ZoneId.of("Asia/Seoul"));

        return new BuildingRegisterJobParametersProvider(collectStatusRepository, clock).create();
    }

    @Test
    @DisplayName("Job 이름을 buildingRegisterJob으로 반환함")
    void Job_이름을_buildingRegisterJob으로_반환함() {
        assertThat(new BuildingRegisterJobParametersProvider(collectStatusRepository, Clock.systemUTC()).jobName())
                .isEqualTo("buildingRegisterJob");
    }

    @Test
    @DisplayName("첫 적재가 끝나지 않았으면 날짜와 상관없이 target을 initial로 계산함")
    void 첫_적재가_끝나지_않았으면_날짜와_상관없이_target을_initial로_계산함() {
        // given
        given(collectStatusRepository.exists("BUILDING_REGISTER")).willReturn(false);

        // when
        JobParameters on25thNovember = createAt("2026-11-24T15:30:00Z");
        JobParameters on25thDecember = createAt("2026-12-24T15:30:00Z");

        // then
        assertThat(on25thNovember.getString("target")).isEqualTo("initial");
        assertThat(on25thDecember.getString("target")).isEqualTo("initial");
        assertThat(on25thNovember.parameters()).hasSize(1);
    }

    @Test
    @DisplayName("첫 적재가 끝났고 실행일(KST)이 25일이면 그 달을 대상 월로 계산함")
    void 첫_적재가_끝났고_실행일_KST이_25일이면_그_달을_대상_월로_계산함() {
        // given
        given(collectStatusRepository.exists("BUILDING_REGISTER")).willReturn(true);

        // when: KST 2026-11-25 00:30, UTC 날짜는 24일
        JobParameters parameters = createAt("2026-11-24T15:30:00Z");

        // then
        assertThat(parameters.getString("target")).isEqualTo("202611");
    }

    @Test
    @DisplayName("첫 적재가 끝났고 실행일(KST)이 24일이면 전달을 대상 월로 계산함")
    void 첫_적재가_끝났고_실행일_KST이_24일이면_전달을_대상_월로_계산함() {
        // given
        given(collectStatusRepository.exists("BUILDING_REGISTER")).willReturn(true);

        // when
        JobParameters dec24 = createAt("2026-12-23T15:30:00Z");
        JobParameters jan25 = createAt("2027-01-24T15:30:00Z");
        JobParameters jan24 = createAt("2027-01-23T15:30:00Z");

        // then
        assertThat(dec24.getString("target")).isEqualTo("202611");
        assertThat(jan25.getString("target")).isEqualTo("202701");
        assertThat(jan24.getString("target")).isEqualTo("202612");
    }
}
