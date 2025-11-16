import { Router } from "express";
import { 
    createProject,
    getProjectById,
    getProjects,
    createProjectMenbers
} from "../controllers/project.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/createProj/:userId").post(createProject)
router.route("/projectMenbers/:userId/:projectId").post(createProjectMenbers)
router.route("/:projectId").get(getProjectById)
router.route("/getProject/:projectMemberId/:projectId/").get(verifyJWT, getProjects)

export default router