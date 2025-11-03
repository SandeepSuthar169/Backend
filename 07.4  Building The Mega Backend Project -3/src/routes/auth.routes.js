import { Router } from "express";
import { 
    registerUser, 
    verifyEmail,
    loginUser, 
    logoutUser  
}from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT }  from "../middlewares/auth.middleware.js";
import { 
    userRegistrationValidator, 
    userLoginValidator,
    userLogoutValidator
} from "../validators/index.js"




const router = Router()

router.route("/register").post(userRegistrationValidator(), validate, registerUser)
router.route("/verifyEmail/:verificationToken").post(verifyEmail);
router.route("/login").post(userLoginValidator(),validate,  loginUser)
router.route("/logout").post(userLogoutValidator() ,verifyJWT ,logoutUser)

// Factrory patten  :-> userRegistrationValidator()

export default router