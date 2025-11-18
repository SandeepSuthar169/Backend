import { Router } from "express";
import { 
    createTask ,
    getAllTasks,
    getTasksById,
    updateTask,
    createSubTask,
    getSubTask
} from "../controllers/task.controllers.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// ================= Task ===================
router.route("/createTask/:userId/:projectId").post(createTask)
    // upload.fields('files', 5),
router.route("/getAllTask/:projectId").get(getAllTasks)
router.route("/getTasksById/:taskId").get(getTasksById)
router.route("/updateTask/:taskId").post(updateTask)


// ================= SubTask ===================
router.route("/createSubTask/:userId/:taskId").post(createSubTask)
router.route("/getSubTask/:taskId").get(getSubTask)

export default router