import { Router } from "express";
import { 
    createTask ,
    getAllTasks,
    getTasksById
} from "../controllers/task.controllers.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/createTask/:userId/:projectId").post(createTask)
    // upload.fields('files', 5),
router.route("/getAllTask/:projectId").get(getAllTasks)
router.route("/getTasksById/:taskId").get(getTasksById)
export default router