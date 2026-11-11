package kr.jipsee.collect.application;

import java.time.Clock;
import java.time.LocalDateTime;
import kr.jipsee.collect.dao.DataSourceDao;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.listener.StepExecutionListener;
import org.springframework.batch.core.step.StepExecution;

/** Step이 성공하면 data_source의 마지막 수집 시각 갱신 */
@RequiredArgsConstructor
public class DataSourceLoadListener implements StepExecutionListener {
    private final DataSourceDao dataSourceDao;
    private final Clock clock;
    private final String source;

    /** Step이 COMPLETED일 때만 현재 시각 저장. 종료 상태는 바꾸지 않음 */
    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        if (stepExecution.getStatus() == BatchStatus.COMPLETED) {
            dataSourceDao.saveLoadedAt(source, LocalDateTime.now(clock));
        }

        return null;
    }
}
