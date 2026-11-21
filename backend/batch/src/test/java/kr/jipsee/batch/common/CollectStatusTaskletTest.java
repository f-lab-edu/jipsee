package kr.jipsee.batch.common;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.then;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import kr.jipsee.deal.service.CollectStatusService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.infrastructure.repeat.RepeatStatus;

@ExtendWith(MockitoExtension.class)
class CollectStatusTaskletTest {

    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-11-03T19:00:00Z"), ZoneId.of("Asia/Seoul"));

    @Mock
    CollectStatusService collectStatusService;

    CollectStatusTasklet tasklet;

    @BeforeEach
    void setUp() {
        tasklet = new CollectStatusTasklet(collectStatusService, CLOCK, "RENT_DEAL");
    }

    @Test
    @DisplayName("실행하면 해당 출처의 loaded_at을 현재 시각(KST)으로 저장하고 FINISHED를 반환함")
    void 실행하면_해당_출처의_loaded_at을_현재_시각_KST으로_저장하고_FINISHED를_반환함() {
        // when
        RepeatStatus status = tasklet.execute(null, null);

        // then
        assertThat(status).isEqualTo(RepeatStatus.FINISHED);
        then(collectStatusService).should().saveLoadedAt("RENT_DEAL", LocalDateTime.of(2026, 11, 4, 4, 0));
    }
}
