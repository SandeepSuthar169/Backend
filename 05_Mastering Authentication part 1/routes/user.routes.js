import express from "express";
import { register } from "../controllers/user.controller.js";

const router = express.Router();

router.get('/resgister', register)

export default router 