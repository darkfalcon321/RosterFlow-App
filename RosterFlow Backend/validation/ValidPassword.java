package com.group10.rosterflow.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordConstraintValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {
    String message() default "Weak password: min 8 chars, include upper, lower, digit";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

