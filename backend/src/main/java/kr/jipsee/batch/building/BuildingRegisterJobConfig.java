package kr.jipsee.batch.building;

import java.time.Clock;
import kr.jipsee.batch.common.CollectStatusRepository;
import kr.jipsee.batch.common.CollectStatusTasklet;
import kr.jipsee.building.client.BldRgstHubClient;
import kr.jipsee.building.dto.BuildingRegisterReplaceItem;
import kr.jipsee.building.service.BuildingRegisterService;
import kr.jipsee.region.dto.LegalDongKey;
import kr.jipsee.region.service.RegionService;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.Step;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

/** 건축물대장 수집 Job과 Step, Reader 빈 구성 */
@Configuration
public class BuildingRegisterJobConfig {
    static final String JOB_NAME = "buildingRegisterJob";
    public static final String PARAM_TARGET = "target";
    public static final String SOURCE = "BUILDING_REGISTER";
    public static final String INITIAL_TARGET = "initial";

    /** 건축물대장 수집 Job. 식별 파라미터는 target */
    @Bean
    Job buildingRegisterJob(JobRepository jobRepository, Step buildingRegisterStep, Step buildingRegisterLoadedAtStep) {
        return new JobBuilder(JOB_NAME, jobRepository)
                .start(buildingRegisterStep)
                .next(buildingRegisterLoadedAtStep)
                .build();
    }

    /** 법정동 하나를 chunk 하나, 트랜잭션 하나로 처리하는 수집 Step */
    @Bean
    Step buildingRegisterStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            LegalDongKeyReader buildingRegisterKeyReader,
            BldRgstHubClient bldRgstHubClient,
            BuildingRegisterService buildingRegisterService) {
        return new StepBuilder("buildingRegisterStep", jobRepository)
                .<LegalDongKey, BuildingRegisterReplaceItem>chunk(1)
                .transactionManager(transactionManager)
                .reader(buildingRegisterKeyReader)
                .processor(new BuildingRegisterProcessor(bldRgstHubClient, buildingRegisterService))
                .writer(new BuildingRegisterWriter(buildingRegisterService))
                .build();
    }

    /** collect_status에 출처 행이 없으면 법정동 사전 전체를, 있으면 필지가 저장된 법정동을 읽는 Reader */
    @Bean
    @StepScope
    LegalDongKeyReader buildingRegisterKeyReader(
            RegionService regionService,
            CollectStatusRepository collectStatusRepository,
            BuildingRegisterService buildingRegisterService) {
        if (!collectStatusRepository.exists(SOURCE)) {
            return new LegalDongKeyReader(regionService.legalDongKeys());
        }
        return new LegalDongKeyReader(buildingRegisterService.findStoredLegalDongs());
    }

    /** BUILDING_REGISTER의 마지막 수집 시각을 갱신하는 Step. 수집 Step 다음에 실행 */
    @Bean
    Step buildingRegisterLoadedAtStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            CollectStatusRepository collectStatusRepository,
            Clock clock) {
        return new StepBuilder("buildingRegisterLoadedAtStep", jobRepository)
                .tasklet(new CollectStatusTasklet(collectStatusRepository, clock, SOURCE), transactionManager)
                .build();
    }
}
