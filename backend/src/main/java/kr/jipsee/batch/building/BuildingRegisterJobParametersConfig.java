package kr.jipsee.batch.building;

import java.time.Clock;
import kr.jipsee.batch.common.CollectStatusRepository;
import kr.jipsee.batch.common.JobParametersProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** 건축물대장 수집 Job의 파라미터 제공자 빈 구성 */
@Configuration
public class BuildingRegisterJobParametersConfig {

    /** 건축물대장 수집 Job의 파라미터 제공자 */
    @Bean
    JobParametersProvider buildingRegisterJobParametersProvider(
            CollectStatusRepository collectStatusRepository, Clock clock) {
        return new BuildingRegisterJobParametersProvider(collectStatusRepository, clock);
    }
}
