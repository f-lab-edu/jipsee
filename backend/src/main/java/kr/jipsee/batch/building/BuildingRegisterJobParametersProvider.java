package kr.jipsee.batch.building;

import static kr.jipsee.batch.building.BuildingRegisterJobConfig.INITIAL_TARGET;
import static kr.jipsee.batch.building.BuildingRegisterJobConfig.JOB_NAME;
import static kr.jipsee.batch.building.BuildingRegisterJobConfig.PARAM_TARGET;
import static kr.jipsee.batch.building.BuildingRegisterJobConfig.SOURCE;

import java.time.Clock;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import kr.jipsee.batch.common.CollectStatusRepository;
import kr.jipsee.batch.common.JobParametersProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;

/** 건축물대장 Job의 파라미터 계산. target은 첫 적재가 끝나기 전에는 initial, 끝난 뒤에는 실행일(KST) 기준 대상 월(yyyyMM) */
@RequiredArgsConstructor
public class BuildingRegisterJobParametersProvider implements JobParametersProvider {
    /** 대상 월이 바뀌는 날. 25일부터 다음 달 24일까지 같은 대상 월 */
    static final int START_DAY = 25;

    private static final DateTimeFormatter TARGET_FORMAT = DateTimeFormatter.ofPattern("yyyyMM");

    private final CollectStatusRepository collectStatusRepository;
    private final Clock clock;

    @Override
    public String jobName() {
        return JOB_NAME;
    }

    @Override
    public JobParameters create() {
        return new JobParametersBuilder().addString(PARAM_TARGET, target()).toJobParameters();
    }

    private String target() {
        if (!collectStatusRepository.exists(SOURCE)) {
            return INITIAL_TARGET;
        }

        return YearMonth.from(LocalDate.now(clock).minusDays(START_DAY - 1)).format(TARGET_FORMAT);
    }
}
