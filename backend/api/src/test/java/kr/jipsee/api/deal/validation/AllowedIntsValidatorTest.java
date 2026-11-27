package kr.jipsee.api.deal.validation;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class AllowedIntsValidatorTest {

    private final Validator validator =
            Validation.buildDefaultValidatorFactory().getValidator();

    record Target(@AllowedInts({6, 12}) Integer value) {}

    @Test
    @DisplayName("허용한 값이면 통과함")
    void 허용한_값이면_통과함() {
        // when
        var violations = validator.validate(new Target(12));

        // then
        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("허용하지 않은 값이면 위반함")
    void 허용하지_않은_값이면_위반함() {
        // when
        var violations = validator.validate(new Target(7));

        // then
        assertThat(violations).hasSize(1);
    }

    @Test
    @DisplayName("null이면 통과함")
    void null이면_통과함() {
        // when
        var violations = validator.validate(new Target(null));

        // then
        assertThat(violations).isEmpty();
    }
}
