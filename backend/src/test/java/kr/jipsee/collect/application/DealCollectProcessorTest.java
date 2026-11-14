package kr.jipsee.collect.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;

import java.time.YearMonth;
import java.util.List;
import kr.jipsee.collect.client.RtmsApiClient;
import kr.jipsee.collect.client.RtmsPage;
import kr.jipsee.collect.dto.DealKey;
import kr.jipsee.collect.dto.DealReplaceItem;
import kr.jipsee.collect.exception.RtmsApiException;
import kr.jipsee.deal.application.DealReplacer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DealCollectProcessorTest {

    private static final YearMonth OCTOBER = YearMonth.of(2026, 10);
    private static final DealKey KEY = new DealKey("11110", OCTOBER);

    @Mock
    RtmsApiClient<String> client;

    @Mock
    DealReplacer<String> replacer;

    DealCollectProcessor<String> processor;

    @BeforeEach
    void setUp() {
        processor = new DealCollectProcessor<>(client, replacer);
    }

    private static RtmsPage<String> page(String resultCode, int totalCount, String... items) {
        return new RtmsPage<>(resultCode, totalCount, List.of(items));
    }

    @Nested
    @DisplayName("교체 조건을 만족하면 거래 목록을 반환함")
    class Replace {

        @Test
        @DisplayName("한 페이지에 모두 담겨 있으면 그 목록을 반환함")
        void 한_페이지에_모두_담겨_있으면_그_목록을_반환함() {
            given(client.fetch("11110", OCTOBER, 1)).willReturn(page("000", 2, "a", "b"));

            DealReplaceItem<String> result = processor.process(KEY);

            assertThat(result).isEqualTo(new DealReplaceItem<>(KEY, List.of("a", "b")));
            then(replacer).shouldHaveNoInteractions();
        }

        @Test
        @DisplayName("여러 페이지면 totalCount만큼 받을 때까지 요청해 하나로 합침")
        void 여러_페이지면_totalCount만큼_받을_때까지_요청해_하나로_합침() {
            given(client.fetch("11110", OCTOBER, 1)).willReturn(page("000", 3, "a", "b"));
            given(client.fetch("11110", OCTOBER, 2)).willReturn(page("000", 3, "c"));

            DealReplaceItem<String> result = processor.process(KEY);

            assertThat(result.rows()).containsExactly("a", "b", "c");
            then(client).should(never()).fetch(any(), any(), eq(3));
        }

        @Test
        @DisplayName("0건이고 기존 행도 없으면 빈 목록을 반환함")
        void 영건이고_기존_행도_없으면_빈_목록을_반환함() {
            given(client.fetch("11110", OCTOBER, 1)).willReturn(page("000", 0));
            given(replacer.countByMonth("11110", OCTOBER)).willReturn(0);

            DealReplaceItem<String> result = processor.process(KEY);

            assertThat(result).isEqualTo(new DealReplaceItem<>(KEY, List.of()));
        }

        @Test
        @DisplayName("거래가 있으면 기존 행 수를 조회하지 않음")
        void 거래가_있으면_기존_행_수를_조회하지_않음() {
            given(client.fetch("11110", OCTOBER, 1)).willReturn(page("000", 1, "a"));

            processor.process(KEY);

            then(replacer).should(never()).countByMonth(any(), any());
        }
    }

    @Test
    @DisplayName("기존 행이 있는데 0건이 오면 null을 반환해 교체하지 않음")
    void 기존_행이_있는데_0건이_오면_null을_반환해_교체하지_않음() {
        given(client.fetch("11110", OCTOBER, 1)).willReturn(page("000", 0));
        given(replacer.countByMonth("11110", OCTOBER)).willReturn(5);

        DealReplaceItem<String> result = processor.process(KEY);

        assertThat(result).isNull();
    }

    @Nested
    @DisplayName("Step을 실패시키는 상황")
    class Fail {

        @Test
        @DisplayName("받은 건수가 totalCount보다 적으면 RtmsApiException을 던짐")
        void 받은_건수가_totalCount보다_적으면_RtmsApiException을_던짐() {
            given(client.fetch("11110", OCTOBER, 1)).willReturn(page("000", 3, "a", "b"));
            given(client.fetch("11110", OCTOBER, 2)).willReturn(page("000", 3));

            Throwable thrown = catchThrowable(() -> processor.process(KEY));

            assertThat(thrown).isInstanceOf(RtmsApiException.class);
        }

        @Test
        @DisplayName("받은 건수가 totalCount보다 많으면 RtmsApiException을 던짐")
        void 받은_건수가_totalCount보다_많으면_RtmsApiException을_던짐() {
            given(client.fetch("11110", OCTOBER, 1)).willReturn(page("000", 1, "a", "b"));

            Throwable thrown = catchThrowable(() -> processor.process(KEY));

            assertThat(thrown).isInstanceOf(RtmsApiException.class);
        }

        @Test
        @DisplayName("클라이언트가 던진 RtmsApiException을 그대로 전달함")
        void 클라이언트가_던진_RtmsApiException을_그대로_전달함() {
            willThrow(new RtmsApiException("일일 호출 허용량 초과 오류 22")).given(client).fetch("11110", OCTOBER, 1);

            Throwable thrown = catchThrowable(() -> processor.process(KEY));

            assertThat(thrown).isInstanceOf(RtmsApiException.class).hasMessageContaining("22");
        }
    }
}
