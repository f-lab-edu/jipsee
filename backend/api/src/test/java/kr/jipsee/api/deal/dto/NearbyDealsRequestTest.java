package kr.jipsee.api.deal.dto;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import kr.jipsee.deal.dto.DealType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class NearbyDealsRequestTest {

    private final Validator validator =
            Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    @DisplayName("값이 없거나 비어 있으면 period 12, jeonse, page 0임")
    void 값이_없거나_비어_있으면_period_12_jeonse_page_0임() {
        // when
        var missing = new NearbyDealsRequest(null, null, null);
        var empty = new NearbyDealsRequest(null, "", null);

        // then
        assertThat(missing).isEqualTo(new NearbyDealsRequest(12, "jeonse", 0));
        assertThat(empty).isEqualTo(new NearbyDealsRequest(12, "jeonse", 0));
        assertThat(validator.validate(missing)).isEmpty();
    }

    @Test
    @DisplayName("period 24, wolse, page 2는 통과함")
    void period_24_wolse_page_2는_통과함() {
        // when
        var request = new NearbyDealsRequest(24, "wolse", 2);

        // then
        assertThat(validator.validate(request)).isEmpty();
        assertThat(request.dealType()).isEqualTo(DealType.WOLSE);
    }

    @ParameterizedTest
    @ValueSource(ints = {0, 3, 13})
    @DisplayName("period가 6, 12, 24가 아니면 위반함")
    void period가_6_12_24가_아니면_위반함(int period) {
        // when
        var violations = validator.validate(new NearbyDealsRequest(period, "jeonse", 0));

        // then
        assertThat(violations).hasSize(1);
    }

    @ParameterizedTest
    @ValueSource(strings = {"sale", "JEONSE"})
    @DisplayName("type이 jeonse, wolse가 아니면 위반함")
    void type이_jeonse_wolse가_아니면_위반함(String type) {
        // when
        var violations = validator.validate(new NearbyDealsRequest(12, type, 0));

        // then
        assertThat(violations).hasSize(1);
    }

    @Test
    @DisplayName("page가 음수면 위반함")
    void page가_음수면_위반함() {
        // when
        var violations = validator.validate(new NearbyDealsRequest(12, "jeonse", -1));

        // then
        assertThat(violations).hasSize(1);
    }
}
