import validator from 'validator';

export const signInValidation = (data) => {
    const { email, password } = data;
    let errors = {};

    // Email validation
    if (validator.isEmpty(email)) {
        errors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
        errors.email = "Email is invalid";
    }

    // Password validation
    if (validator.isEmpty(password)) {
        errors.password = " Password is required";
    } else {
        if (!validator.isLength(password, { min: 6 })) {
            errors.password = "Password must be at least 6 characters long";
        }
        if(!validator.isStrongPassword(password, {
            minLength:6,
            minLowercase:1,
            minUppercase:1,
            minNumbers:1,
            minSymbols:1
        })) {
            errors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol";
        }
        if(validator.contains(password, ' ')) {
            errors.password = "Password must not contain spaces";
        }
    }
   return {
        errors,
        isValid: Object.keys(errors).length === 0
   };


}