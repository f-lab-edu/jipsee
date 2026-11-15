package kr.jipsee.collect.application;

import java.time.Clock;
import java.time.LocalDateTime;
import kr.jipsee.collect.dao.DataSourceDao;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.StepContribution;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.infrastructure.repeat.RepeatStatus;

/** 수집 Step이 끝난 뒤 data_source의 마지막 수집 시각 갱신 */
@RequiredArgsConstructor
public class DataSourceLoadTasklet implements Tasklet {
    private final DataSourceDao dataSourceDao;
    private final Clock clock;
    private final String source;

    /** 출처의 마지막 수집 시각을 현재 시각으로 저장. 실패하면 예외를 던져 Step을 실패시킴 */
    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        dataSourceDao.saveLoadedAt(source, LocalDateTime.now(clock));

        return RepeatStatus.FINISHED;
    }
}
