import express from 'express'
import { registerUser } from '../controler/user.controller.js'
import { verifyUser}  from '../controler/user.controller.js'
import { login } from '../controler/user.controller.js'


const router = express.Router()

router.post("/register", registerUser)
router.get("/verify/:token", verifyUser)
router.post("/login", login)


export default router;
