import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator } from "../validators/index.js"




const router = Router()

router.route("/register").post(userRegistrationValidator(), validate, registerUser)
// Factrory patten  :-> userRegistrationValidator()

export default router