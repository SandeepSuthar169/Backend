import express from 'express'
import { registerUser } from '../controler/user.controller.js'

const router = express.Router()

router.get("/register", registerUser)

export default router;
