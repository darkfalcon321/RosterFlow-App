package com.group10.rosterflow.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext ctx) {
        if (value == null) return false;

        boolean ok = value.length() >= 8
                && value.matches(".*[A-Z].*")
                && value.matches(".*[a-z].*")
                && value.matches(".*\\d.*");

        if (!ok) {
            ctx.disableDefaultConstraintViolation();
            ctx.buildConstraintViolationWithTemplate(
                    "Weak password: min 8 chars, include upper, lower, digit"
            ).addConstraintViolation();
        }
        return ok;
    }
}
