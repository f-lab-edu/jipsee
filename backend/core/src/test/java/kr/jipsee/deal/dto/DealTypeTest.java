package kr.jipsee.deal.dto;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

class DealTypeTest {

    @Nested
    @DisplayName("fromCode")
    class FromCode {

        @ParameterizedTest
        @NullSource
        @ValueSource(strings = {"unknown", "JEONSE"})
        @DisplayName("null이거나 알 수 없는 코드는 예외를 던짐")
        void null이거나_알_수_없는_코드는_예외를_던짐(String code) {
            // when, then
            assertThatThrownBy(() -> DealType.fromCode(code)).isInstanceOf(IllegalArgumentException.class);
        }
    }
}
