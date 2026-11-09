package kr.jipsee.collect.application;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.YearMonth;
import java.util.List;
import kr.jipsee.collect.dto.DealKey;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.infrastructure.item.ExecutionContext;

class DealKeyReaderTest {

    private final List<DealKey> keys =
            DealKeys.of(YearMonth.of(2026, 9), YearMonth.of(2026, 10), List.of("11110", "11140"));

    @Test
    @DisplayName("키를 순서대로 읽고 모두 읽으면 null을 반환함")
    void 키를_순서대로_읽고_모두_읽으면_null을_반환함() throws Exception {
        DealKeyReader reader = new DealKeyReader(keys);
        reader.open(new ExecutionContext());

        List<DealKey> read = List.of(reader.read(), reader.read(), reader.read(), reader.read());

        assertThat(read).isEqualTo(keys);
        assertThat(reader.read()).isNull();
    }

    @Test
    @DisplayName("마지막으로 저장한 위치부터 이어서 읽음")
    void 마지막으로_저장한_위치부터_이어서_읽음() throws Exception {
        // given
        ExecutionContext context = new ExecutionContext();
        DealKeyReader reader = new DealKeyReader(keys);
        reader.open(context);
        reader.read();
        reader.read();
        reader.update(context);
        reader.read(); // 저장하지 않은 읽기
        reader.close();

        // when
        DealKeyReader restarted = new DealKeyReader(keys);
        restarted.open(context);

        // then
        assertThat(restarted.read()).isEqualTo(keys.get(2));
        assertThat(restarted.read()).isEqualTo(keys.get(3));
        assertThat(restarted.read()).isNull();
    }
}
