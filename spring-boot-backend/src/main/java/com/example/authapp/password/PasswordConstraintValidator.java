package com.example.authapp.password;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, String> {

    private static final String PASSWORD_PATTERN =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$";

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        System.out.println("Validating password: " + password); // Debug
        return password != null && password.matches(PASSWORD_PATTERN);
    }

}
