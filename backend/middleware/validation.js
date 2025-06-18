const { check, validationResult } = require('express-validator');

// Signup validation rules
const signupValidationRules = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name must contain only letters and spaces'),
    check('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address'),
    check('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) 
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Login validation rules
const loginValidationRules = [
    check('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address'),
    check('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// Common validator middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    signupValidationRules,
    loginValidationRules,
    validate
};
