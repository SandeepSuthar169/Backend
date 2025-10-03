import express from "express";
import { login, register, verify, getProfile } from "../controllers/user.controller.js";
import isLoggedIn from "../middleware/isLoggedin.js";


const router = express.Router();

router.post('/resgister', register);
router.get('/verify/:token', verify);
router.post('/login', login);
router.get('/get-profile', isLoggedIn, getProfile)

export default router 