package kr.jipsee.batch.deal;

import kr.jipsee.deal.service.DealGroupRefreshService;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.StepContribution;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.infrastructure.repeat.RepeatStatus;

/** 수집 Step이 끝난 뒤 건물 검색용 deal_group 테이블 갱신 */
@RequiredArgsConstructor
public class DealGroupRefreshTasklet implements Tasklet {
    private final DealGroupRefreshService dealGroupRefreshService;

    /** deal_group을 전체 재생성. 실패하면 예외를 던져 Step 실패 처리 */
    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        dealGroupRefreshService.refresh();

        return RepeatStatus.FINISHED;
    }
}
