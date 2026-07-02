const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }

    next();
};

const signupValidator = [

    body("name")
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage("Name must be between 20 and 60 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 8, max: 16 })
        .withMessage("Password must be between 8 and 16 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must contain at least one special character"),

    body("address")
        .trim()
        .notEmpty()
        .isLength({ max: 400 }).
         withMessage("Address is required")
        .withMessage("Address cannot exceed 400 characters"),

    validate
];


const loginValidator = [

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    validate
];


const updatePasswordValidator = [

    body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required"),

    body("newPassword")
        .isLength({ min: 8, max: 16 })
        .withMessage("Password must be between 8 and 16 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[^\w\s]/)
        .withMessage("Password must contain at least one special character")
        .notEmpty()
        .withMessage("New password required") ,

    validate
];

module.exports = {
    signupValidator,
    loginValidator,
    updatePasswordValidator,
};
