import { Router } from "express";
import { 
    UserRolesEnum, 
    AvailableUserRoles 
} from "../utils/constants.js";
import { validateProjectPermission } from "../middlewares/auth.middleware.js";
import {
    createNote,
    getNotes,
    getNotesById
} from "../controllers/note.controllers.js"

const router = Router()

router.route("/createNote/:userId/:projectId").post(createNote)
router.route("/getNotes/:projectId").get(getNotes)
router.route("/getNotesById/:noteId").get(getNotesById)

export default router