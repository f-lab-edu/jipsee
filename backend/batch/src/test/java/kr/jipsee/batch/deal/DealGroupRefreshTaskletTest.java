package kr.jipsee.batch.deal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;

import kr.jipsee.deal.service.DealGroupRefreshService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.infrastructure.repeat.RepeatStatus;

@ExtendWith(MockitoExtension.class)
class DealGroupRefreshTaskletTest {

    @Mock
    DealGroupRefreshService dealGroupRefreshService;

    @InjectMocks
    DealGroupRefreshTasklet tasklet;

    @Test
    @DisplayName("실행하면 deal_group을 갱신하고 FINISHED를 반환함")
    void 실행하면_deal_group을_갱신하고_FINISHED를_반환함() {
        // when
        RepeatStatus status = tasklet.execute(null, null);

        // then
        assertThat(status).isEqualTo(RepeatStatus.FINISHED);
        then(dealGroupRefreshService).should().refresh();
    }

    @Test
    @DisplayName("갱신이 예외를 던지면 그대로 전파함")
    void 갱신이_예외를_던지면_그대로_전파함() {
        // given
        IllegalStateException failure = new IllegalStateException("테스트용 실패");
        willThrow(failure).given(dealGroupRefreshService).refresh();

        // when
        Throwable thrown = catchThrowable(() -> tasklet.execute(null, null));

        // then
        assertThat(thrown).isSameAs(failure);
    }
}
