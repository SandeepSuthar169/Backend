import { Router } from "express";
import { 
    createTask 
} from "../controllers/task.controllers";

const router = Router()

router.route("/createTask/:projectId").post(createTask)

export default router