package kr.jipsee.batch.building;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import kr.jipsee.batch.common.CollectStatusRepository;
import kr.jipsee.batch.common.JobParametersProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BuildingRegisterJobParametersConfigTest {

    @Mock
    CollectStatusRepository collectStatusRepository;

    @Test
    @DisplayName("Job 이름이 같은 파라미터 제공자를 만듦")
    void Job_이름이_같은_파라미터_제공자를_만듦() {
        // when
        JobParametersProvider provider = new BuildingRegisterJobParametersConfig()
                .buildingRegisterJobParametersProvider(collectStatusRepository, Clock.systemUTC());

        // then
        assertThat(provider.jobName()).isEqualTo("buildingRegisterJob");
    }
}
