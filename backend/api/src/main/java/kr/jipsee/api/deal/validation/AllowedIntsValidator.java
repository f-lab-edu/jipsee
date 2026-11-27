package kr.jipsee.api.deal.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;

public class AllowedIntsValidator implements ConstraintValidator<AllowedInts, Integer> {

    private int[] allowed;

    @Override
    public void initialize(AllowedInts constraint) {
        this.allowed = constraint.value();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null || Arrays.stream(allowed).anyMatch(candidate -> candidate == value);
    }
}
