package kr.jipsee.api.deal.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/** 단어 구분은 연속된 공백 문자 */
public class MaxWordsValidator implements ConstraintValidator<MaxWords, String> {

    private int max;

    @Override
    public void initialize(MaxWords constraint) {
        this.max = constraint.value();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null || value.split("\\s+").length <= max;
    }
}
