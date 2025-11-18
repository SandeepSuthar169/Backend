import { Router } from "express";
import { 
    createTask ,
    getAllTasks,
    getTasksById,
    updateTask,
    createSubTask,
    getSubTask,
    updateSubTask,
    deleteSubTask,
    deleteTask
} from "../controllers/task.controllers.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// ================= Task ===================
router.route("/createTask/:userId/:projectId").post(createTask)
router.route("/getAllTask/:projectId").get(getAllTasks)
router.route("/getTasksById/:taskId").get(getTasksById)
router.route("/updateTask/:taskId").post(updateTask)
router.route("/deleteTask/:taskId").delete(deleteTask)


// ================= SubTask ===================
router.route("/createSubTask/:userId/:taskId").post(createSubTask)
router.route("/createSubTask/:taskId").get(getSubTask)
router.route("/updateSubTask/:subTaskId").post(updateSubTask)
router.route("/deleteSubTask/:subTaskId").delete(deleteSubTask)

export default router