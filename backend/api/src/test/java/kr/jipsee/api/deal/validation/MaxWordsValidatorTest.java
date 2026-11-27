package kr.jipsee.api.deal.validation;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MaxWordsValidatorTest {

    private final Validator validator =
            Validation.buildDefaultValidatorFactory().getValidator();

    record Target(@MaxWords(3) String text) {}

    @Test
    @DisplayName("단어 수가 제한 이하이면 통과함")
    void 단어_수가_제한_이하이면_통과함() {
        // when
        var violations = validator.validate(new Target("가  나\t다"));

        // then
        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("단어 수가 제한을 넘으면 위반함")
    void 단어_수가_제한을_넘으면_위반함() {
        // when
        var violations = validator.validate(new Target("가 나 다 라"));

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
