import { Router } from "express";
import { 
    createProject
} from "../controllers/project.controllers.js";

const router = Router()

router.route("/createProj/:userId").post(createProject)

export default router