import { Router } from "express";
import { 
    registerUser, 
    verifyEmail,
    loginUser, 
    logoutUser,
    resendVerificationiEmail,
    refreshAccessToken
}from "../controllers/auth.controllers.js";
// import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT }  from "../middlewares/auth.middleware.js";
import { 
    userRegistrationValidator, 
    userLoginValidator,
    userLogoutValidator,
    userVerificationiEmailtValidator
} from "../validators/index.js"




const router = Router()

router.route("/register").post(userRegistrationValidator(), registerUser)
router.route("/verifyEmail/:verificationToken").post(verifyEmail);
router.route("/login").post(userLoginValidator(),  loginUser)
router.route("/logout").post(userLogoutValidator(),verifyJWT ,logoutUser)
router.route("/verificationiEmail").post(userVerificationiEmailtValidator(), resendVerificationiEmail)
router.route("/refreshAccessToken").post(refreshAccessToken)
// Factrory patten  :-> userRegistrationValidator()

export default router