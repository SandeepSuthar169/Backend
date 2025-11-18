import { body } from "express-validator"

const userRegistrationValidator = () => {
    return [
        body('email')
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty().withMessage("username is required")
            .isLength({min: 3}).withMessage("username should be at least 2 char")
            .isLength({max: 13}).withMessage("username cannot exceed 13 char"),        
        // body("fullname")
        //     .trim()
        //     .notEmpty().withMessage("fullname is required")
        //     .isLength({min: 3}).withMessage("fullname should be at least 2 char")
        //     .isLength({max: 13}).withMessage("fullname cannot exceed 13 char"),        
    ]
}


const userLoginValidator = () => {
    return [
        body('email')
            .isEmail().withMessage("Email is not valid")
            .notEmpty().withMessage("Email is required"),
        body("password")
            .notEmpty().withMessage("Password connot be empty")
            .isLength({min: 5}).withMessage("password should be at length gt 5") 
            .isLength({max: 20}).withMessage("password should be at length ls 20") 

    ]
} 

const userLogoutValidator = () => {
    return [
        body("email")
            .isEmail().withMessage("Email is not valid")
            .notEmpty().withMessage("Email is required"),
        body("password")
            .isLength({min: 5}).withMessage("password should be at length gt 5") 
            .isLength({max: 20}).withMessage("password should be at length ls 20") 
    ]
}
const userVerificationiEmailtValidator = () => {
    return [
        body("email")
            .isEmail().withMessage("Email is not valid")
            .notEmpty().withMessage("Email is required"),
        
    ]
}

export { 
    userRegistrationValidator, 
    userLoginValidator,
    userLogoutValidator,
    userVerificationiEmailtValidator
}