package kr.jipsee.collect.client;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;

import java.math.BigDecimal;
import java.time.LocalDate;
import kr.jipsee.collect.exception.DealApiException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.json.JsonMapper;

class RtmsItemTest {

    private static final JsonMapper JSON = JsonMapper.builder().build();

    private static RtmsItem item(String json) {
        return RtmsItem.of(JSON.readTree(json));
    }

    @Nested
    @DisplayName("빈 값")
    class Blank {

        @Test
        @DisplayName("값이 정확히 공백 1자이면 null을 반환함")
        void 값이_정확히_공백_1자이면_null을_반환함() {
            RtmsItem item = item("{\"preDeposit\":\" \"}");

            assertThat(item.optionalText("preDeposit")).isNull();
            assertThat(item.optionalInt("preDeposit")).isNull();
            assertThat(item.optionalShortDate("preDeposit")).isNull();
        }

        @Test
        @DisplayName("층이 공백 1자이면 null이고 숫자이면 정수로 읽음")
        void 층이_공백_1자이면_null이고_숫자이면_정수로_읽음() {
            assertThat(item("{\"floor\":\" \"}").optionalInt("floor")).isNull();
            assertThat(item("{\"floor\":4}").optionalInt("floor")).isEqualTo(4);
        }

        @Test
        @DisplayName("필드가 없으면 null을 반환함")
        void 필드가_없으면_null을_반환함() {
            assertThat(item("{}").optionalText("mhouseNm")).isNull();
        }

        @Test
        @DisplayName("공백 1자가 아닌 값은 다듬지 않고 그대로 반환함")
        void 공백_1자가_아닌_값은_다듬지_않고_그대로_반환함() {
            RtmsItem item = item("{\"a\":\"효동빌라\u3000\",\"b\":\"  \",\"c\":\" 가 \"}");

            assertThat(item.optionalText("a")).isEqualTo("효동빌라\u3000");
            assertThat(item.optionalText("b")).isEqualTo("  ");
            assertThat(item.optionalText("c")).isEqualTo(" 가 ");
        }

        @Test
        @DisplayName("읍면동명의 괄호와 한자는 그대로 반환함")
        void 읍면동명의_괄호와_한자는_그대로_반환함() {
            assertThat(item("{\"umdNm\":\"진량읍 평사리 (平沙)\"}").requiredText("umdNm"))
                    .isEqualTo("진량읍 평사리 (平沙)");
        }

        @Test
        @DisplayName("NOT NULL 컬럼에 해당하는 필드가 비어 있으면 DealApiException을 던짐")
        void NOT_NULL_컬럼에_해당하는_필드가_비어_있으면_DealApiException을_던짐() {
            RtmsItem item = item("{\"umdNm\":\" \",\"excluUseAr\":\" \"}");

            assertThat(catchThrowable(() -> item.requiredText("umdNm")))
                    .isInstanceOf(DealApiException.class)
                    .hasMessageContaining("umdNm");
            assertThat(catchThrowable(() -> item.requiredInt("deposit")))
                    .isInstanceOf(DealApiException.class)
                    .hasMessageContaining("deposit");
            assertThat(catchThrowable(() -> item.requiredDecimal("excluUseAr")))
                    .isInstanceOf(DealApiException.class)
                    .hasMessageContaining("excluUseAr");
        }
    }

    @Nested
    @DisplayName("숫자와 문자열이 섞인 값")
    class MixedTypes {

        @Test
        @DisplayName("같은 필드가 숫자로 와도 문자열로 와도 텍스트로 읽음")
        void 같은_필드가_숫자로_와도_문자열로_와도_텍스트로_읽음() {
            assertThat(item("{\"jibun\":130}").requiredText("jibun")).isEqualTo("130");
            assertThat(item("{\"jibun\":\"130-69\"}").requiredText("jibun")).isEqualTo("130-69");
            assertThat(item("{\"mhouseNm\":12}").optionalText("mhouseNm")).isEqualTo("12");
        }

        @Test
        @DisplayName("지번 원본 값은 N이나 N-M이 아니어도 그대로 반환함")
        void 지번_원본_값은_N이나_N_M이_아니어도_그대로_반환함() {
            assertThat(item("{\"jibun\":\"산87-85\"}").requiredText("jibun")).isEqualTo("산87-85");
            assertThat(item("{\"jibun\":\"BL-31-4\"}").requiredText("jibun")).isEqualTo("BL-31-4");
        }

        @Test
        @DisplayName("금액의 콤마를 없애 정수로 바꿈")
        void 금액의_콤마를_없애_정수로_바꿈() {
            assertThat(item("{\"deposit\":\"31,000\"}").requiredInt("deposit")).isEqualTo(31000);
            assertThat(item("{\"deposit\":5000}").requiredInt("deposit")).isEqualTo(5000);
            assertThat(item("{\"monthlyRent\":\"1,070\"}").requiredInt("monthlyRent"))
                    .isEqualTo(1070);
            assertThat(item("{\"preDeposit\":66}").optionalInt("preDeposit")).isEqualTo(66);
        }

        @Test
        @DisplayName("정수로 읽을 수 없는 값이면 DealApiException을 던짐")
        void 정수로_읽을_수_없는_값이면_DealApiException을_던짐() {
            Throwable thrown =
                    catchThrowable(() -> item("{\"deposit\":\"abc\"}").requiredInt("deposit"));

            assertThat(thrown).isInstanceOf(DealApiException.class).hasMessageContaining("deposit");
        }

        @Test
        @DisplayName("전용면적은 정수와 소수를 모두 BigDecimal로 읽음")
        void 전용면적은_정수와_소수를_모두_BigDecimal로_읽음() {
            assertThat(item("{\"excluUseAr\":64}").requiredDecimal("excluUseAr"))
                    .isEqualByComparingTo("64");
            assertThat(item("{\"excluUseAr\":69.99}").requiredDecimal("excluUseAr"))
                    .isEqualByComparingTo("69.99");
            assertThat(item("{\"excluUseAr\":12.3456}").requiredDecimal("excluUseAr"))
                    .isEqualByComparingTo(new BigDecimal("12.3456"));
        }
    }

    @Test
    @DisplayName("해제일 YY.MM.DD를 20YY-MM-DD로 바꿈")
    void 해제일_YY_MM_DD를_20YY_MM_DD로_바꿈() {
        assertThat(item("{\"cdealDay\":\"26.03.15\"}").optionalShortDate("cdealDay"))
                .isEqualTo(LocalDate.of(2026, 3, 15));
    }
}
