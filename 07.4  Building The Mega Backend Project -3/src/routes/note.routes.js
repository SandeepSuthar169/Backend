import { Router } from "express";
import { 
    UserRolesEnum, 
    AvailableUserRoles 
} from "../utils/constants.js";
import { validateProjectPermission } from "../middlewares/auth.middleware.js";
import {
    createNote,
    updateNote,
    getNotesById,
    updateNote,
    deleteNote
} from "../controllers/note.controllers.js"

const router = Router()

router.route("/createNote/:userId/:projectId").post(createNote)

export default router