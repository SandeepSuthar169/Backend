import { Router } from "express";
import { 
    createProject,
    getProjectById,
    getProjects,
    createProjectMenbers,
    updateProject,
    deleteProject,
    getProjectMembers,
    addMemberToProject,
    updateProjectMembers,
    deleteMember
} from "../controllers/project.controllers.js";
import { 
    verifyJWT, 
    validateProjectPermission 
} from "../middlewares/auth.middleware.js";


const router = Router()
// ============== PROJECT ===========
router.route("/createProj/:userId").post(createProject)
router.route("/:projectId").get(getProjectById)
router.route("/getProject/:projectMemberId/:projectId").get(verifyJWT, validateProjectPermission(['admin', 'project_admin']), getProjects)  //pending
router.route("/updateProject/:projectId").post(updateProject)
router.route("/deleteProject/:projectId").delete(verifyJWT, deleteProject)   // pending

// =============== MAMBER ===========
router.route("/projectManabers/:userId/:projectId").post(createProjectMenbers)
router.route("/getProjectMembers/:projectMemberId").get(getProjectMembers)
router.route("/memberToProject/:projectId").post(verifyJWT, addMemberToProject)
router.route("/updateProjectMembers/:projectId").post(verifyJWT, updateProjectMembers)
router.route("/deleteMember/:projectMemberId").delete(deleteMember)



export default router