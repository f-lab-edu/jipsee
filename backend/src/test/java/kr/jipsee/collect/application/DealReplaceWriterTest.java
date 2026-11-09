package kr.jipsee.collect.application;

import static org.mockito.BDDMockito.then;

import java.time.YearMonth;
import java.util.List;
import kr.jipsee.collect.dto.DealKey;
import kr.jipsee.collect.dto.DealReplaceItem;
import kr.jipsee.deal.application.DealReplacer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.infrastructure.item.Chunk;

@ExtendWith(MockitoExtension.class)
class DealReplaceWriterTest {

    private static final YearMonth OCTOBER = YearMonth.of(2026, 10);

    @Mock
    DealReplacer<String> replacer;

    @InjectMocks
    DealReplaceWriter<String> writer;

    @Test
    @DisplayName("항목마다 시군구와 계약 월 단위로 교체를 요청함")
    void 항목마다_시군구와_계약_월_단위로_교체를_요청함() {
        Chunk<DealReplaceItem<String>> chunk =
                new Chunk<>(new DealReplaceItem<>(new DealKey("11110", OCTOBER), List.of("a", "b")));

        writer.write(chunk);

        then(replacer).should().replace("11110", OCTOBER, List.of("a", "b"));
    }

    @Test
    @DisplayName("빈 목록도 교체를 요청함")
    void 빈_목록도_교체를_요청함() {
        Chunk<DealReplaceItem<String>> chunk =
                new Chunk<>(new DealReplaceItem<>(new DealKey("11110", OCTOBER), List.of()));

        writer.write(chunk);

        then(replacer).should().replace("11110", OCTOBER, List.of());
    }
}
