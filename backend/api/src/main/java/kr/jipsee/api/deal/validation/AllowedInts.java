package kr.jipsee.api.deal.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** 값이 value 중 하나여야 함. null은 통과 */
@Documented
@Constraint(validatedBy = AllowedIntsValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface AllowedInts {

    String message() default "허용하지 않는 값";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    int[] value();
}
