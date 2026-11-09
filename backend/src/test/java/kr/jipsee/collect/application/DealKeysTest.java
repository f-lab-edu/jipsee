package kr.jipsee.collect.application;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import kr.jipsee.collect.dto.DealKey;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DealKeysTest {
    private static final List<String> CODES = List.of("11110", "11140");

    @Test
    @DisplayName("월은 최근 달부터 내림차순이고 같은 달 안에서는 시군구 코드 오름차순으로 구성함")
    void 월은_최근_달부터_내림차순이고_같은_달_안에서는_시군구_코드_오름차순으로_구성함() {
        List<DealKey> dealKeys = DealKeys.of(YearMonth.of(2026, 8), YearMonth.of(2026, 10), CODES);

        assertThat(dealKeys)
                .containsExactly(
                        new DealKey("11110", YearMonth.of(2026, 10)), new DealKey("11140", YearMonth.of(2026, 10)),
                        new DealKey("11110", YearMonth.of(2026, 9)), new DealKey("11140", YearMonth.of(2026, 9)),
                        new DealKey("11110", YearMonth.of(2026, 8)), new DealKey("11140", YearMonth.of(2026, 8)));
    }

    @Test
    @DisplayName("첫 달이 마지막 달보다 늦으면 빈 목록을 반환함")
    void 첫_달이_마지막_달보다_늦으면_빈_목록을_반환함() {
        assertThat(DealKeys.of(YearMonth.of(2011, 1), YearMonth.of(2006, 3), CODES))
                .isEmpty();
    }

    @Test
    @DisplayName("전월세 초기 적재 범위는 2011-01부터 2026-10까지 190개월임")
    void 전월세_초기_적재_범위는_2011_01부터_2026_10까지_190개월임() {
        assertThat(DealKeys.of(YearMonth.of(2011, 1), YearMonth.of(2026, 10), CODES))
                .hasSize(190 * 2);
    }

    @Test
    @DisplayName("일일 수집은 수집 날짜가 속한 달을 포함해 6개월을 만듦")
    void 일일_수집은_수집_날짜가_속한_달을_포함해_6개월을_만듦() {
        List<DealKey> keys = DealKeys.recent(LocalDate.of(2026, 11, 4), CODES);

        assertThat(keys).hasSize(6 * 2);
        assertThat(keys.getFirst()).isEqualTo(new DealKey("11110", YearMonth.of(2026, 11)));
        assertThat(keys.getLast()).isEqualTo(new DealKey("11140", YearMonth.of(2026, 6)));
    }

    @Test
    @DisplayName("일일 수집 범위가 해를 넘어가면 지난해 달까지 만듦")
    void 일일_수집_범위가_해를_넘어가면_지난해_달까지_만듦() {
        List<DealKey> keys = DealKeys.recent(LocalDate.of(2027, 2, 1), CODES);

        assertThat(keys.getFirst()).isEqualTo(new DealKey("11110", YearMonth.of(2027, 2)));
        assertThat(keys.getLast()).isEqualTo(new DealKey("11140", YearMonth.of(2026, 9)));
    }
}
