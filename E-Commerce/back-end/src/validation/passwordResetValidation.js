import validator from 'validator';
import isEmpty from './isEmpty.js';

export const forgotPasswordValidation = (data) => {
    let errors = {};

    // Convert empty fields to empty string for validator
    data.email = !isEmpty(data.email) ? data.email : "";

    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export const resetPasswordValidation = (data) => {
    let errors = {};

    // Convert empty fields to empty string for validator
    data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : "";
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";

    if (validator.isEmpty(data.newPassword)) {
        errors.newPassword = "New password is required";
    } else if (!validator.isLength(data.newPassword, { min: 6, max: 30 })) {
        errors.newPassword = "Password must be between 6 and 30 characters";
    }

    if (validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Confirm password is required";
    } else if (!validator.equals(data.newPassword, data.confirmPassword)) {
        errors.confirmPassword = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
