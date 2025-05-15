import validator from 'validator';
export const updateUserPasswordValidation = (data) => {
    const { currentPassword, newPassword } = data;
    let errors = {};

    // Current password validation
    if (validator.isEmpty(currentPassword)) {
        errors.currentPassword = "Current password is required";
    }

    // New password validation
    if (validator.isEmpty(newPassword)) {
        errors.newPassword = "New password is required";
    } else {
        if (!validator.isLength(newPassword, { min: 6 })) {
            errors.newPassword = "Password must be at least 6 characters long";
        } else if (!validator.isStrongPassword(newPassword, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            errors.newPassword = "Password must contain at least one uppercase, one lowercase, one number, and one symbol";
        }
        if (validator.contains(newPassword, ' ')) {
            errors.newPassword = "Password must not contain spaces";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};