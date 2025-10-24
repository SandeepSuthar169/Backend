import { Router } from "express";
import { UserRolesEnum, AvailableUserRoles } from "../utils/constants.js";
import { validateProjectPermission } from "../middlewares/auth.middleware.js";
import { deleteNote, getNoteById } from "c:/Users/Sande/AppData/Local/Temp/198735cc-52d8-429c-9405-59a94cd6e768_cohort_project_camp_lyst1756965751951.zip.768/cohort-project-camp/cohort-camp-backend/src/controllers/note.controllers.js";
import { updateNote } from "../controllers/note.controllers.js";

const router = Router()
router.route("/:projectId")
    .get(
        validateProjectPermission(AvailableUserRoles),
        getNotes)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        createNote)


router.route("/:projectId/n/:noteId")
    .get(validateProjectPermission(AvailableUserRoles), 
        getNoteById)
    .put(validateProjectPermission([UserRolesEnum.ADMIN]),
        updateNote)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteNote)

export default router