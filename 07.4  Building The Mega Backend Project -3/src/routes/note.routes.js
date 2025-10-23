import { Router } from "express";
import { UserRolesEnum } from "../utils/constants.js";
import { validateProjectPermission } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/:projectId")
    .get(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
        getNotes)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
        createNote)

export default router