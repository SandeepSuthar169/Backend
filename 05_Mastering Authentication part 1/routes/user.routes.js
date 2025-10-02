import express from "express";
import { login, register, verify } from "../controllers/user.controller.js";


const router = express.Router();

router.post('/resgister', register);
router.get('/verify/:token', verify);
router.post('/login', login);

export default router 