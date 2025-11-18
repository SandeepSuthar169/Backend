import { Router } from "express";
import { 
    createTask ,
    getAllTasks
} from "../controllers/task.controllers.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/createTask/:userId/:projectId").post(createTask)
    // upload.fields('files', 5),
router.route("/getAllTask/:projectId").get(getAllTasks)
export default router