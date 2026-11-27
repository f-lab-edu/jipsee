package kr.jipsee.deal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;

import kr.jipsee.deal.repository.DealGroupRefreshRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DealGroupRefreshServiceTest {

    @Mock
    DealGroupRefreshRepository dealGroupRefreshRepository;

    @InjectMocks
    DealGroupRefreshService dealGroupRefreshService;

    @Test
    @DisplayName("갱신하면 저장소의 rebuild를 호출함")
    void 갱신하면_저장소의_rebuild를_호출함() {
        // when
        dealGroupRefreshService.refresh();

        // then
        then(dealGroupRefreshRepository).should().rebuild();
    }

    @Test
    @DisplayName("저장소가 예외를 던지면 그대로 전파함")
    void 저장소가_예외를_던지면_그대로_전파함() {
        // given
        IllegalStateException failure = new IllegalStateException("테스트용 실패");
        willThrow(failure).given(dealGroupRefreshRepository).rebuild();

        // when
        Throwable thrown = catchThrowable(() -> dealGroupRefreshService.refresh());

        // then
        assertThat(thrown).isSameAs(failure);
    }
}
