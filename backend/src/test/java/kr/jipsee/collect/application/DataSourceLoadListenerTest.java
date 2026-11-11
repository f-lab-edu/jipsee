package kr.jipsee.collect.application;

import static org.mockito.BDDMockito.then;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import kr.jipsee.collect.dao.DataSourceDao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.JobInstance;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.step.StepExecution;

@ExtendWith(MockitoExtension.class)
class DataSourceLoadListenerTest {

    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-11-03T19:00:00Z"), ZoneId.of("Asia/Seoul"));

    @Mock
    DataSourceDao dataSourceDao;

    DataSourceLoadListener listener;
    StepExecution stepExecution;

    @BeforeEach
    void setUp() {
        listener = new DataSourceLoadListener(dataSourceDao, CLOCK, "RENT_DEAL");
        JobExecution jobExecution =
                new JobExecution(1L, new JobInstance(1L, "dailyRentCollectJob"), new JobParameters());
        stepExecution = new StepExecution(1L, "dailyRentStep", jobExecution);
    }

    @Test
    @DisplayName("Step이 COMPLETED로 끝나면 해당 출처의 loaded_at을 현재 시각(KST)으로 저장함")
    void Step이_COMPLETED로_끝나면_해당_출처의_loaded_at을_현재_시각_KST으로_저장함() {
        stepExecution.setStatus(BatchStatus.COMPLETED);

        listener.afterStep(stepExecution);

        then(dataSourceDao).should().saveLoadedAt("RENT_DEAL", LocalDateTime.of(2026, 11, 4, 4, 0));
    }

    @Test
    @DisplayName("Step이 FAILED로 끝나면 저장하지 않음")
    void Step이_FAILED로_끝나면_저장하지_않음() {
        stepExecution.setStatus(BatchStatus.FAILED);

        listener.afterStep(stepExecution);

        then(dataSourceDao).shouldHaveNoInteractions();
    }
}
