import express from "express";

import { googleCallback, getProfile, logout, googleLogin } from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router()

router.get("/google", googleLogin);
router.get("/googleCallback", googleCallback);


export default router
