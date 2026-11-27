package kr.jipsee.api.deal.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** 공백으로 구분한 단어 수가 value 이하여야 함. null은 통과 */
@Documented
@Constraint(validatedBy = MaxWordsValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface MaxWords {

    String message() default "단어 수가 제한을 넘음";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    int value();
}
