package kr.jipsee.deal.dto;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class ContractTypeTest {

    @Nested
    @DisplayName("fromCode")
    class FromCode {

        @Test
        @DisplayName("null은 null을 반환함")
        void null은_null을_반환함() {
            // when, then
            assertThat(ContractType.fromCode(null)).isNull();
        }

        @Test
        @DisplayName("알 수 없는 코드는 예외를 던짐")
        void 알_수_없는_코드는_예외를_던짐() {
            // when, then
            assertThatThrownBy(() -> ContractType.fromCode("unknown")).isInstanceOf(IllegalArgumentException.class);
        }
    }
}
