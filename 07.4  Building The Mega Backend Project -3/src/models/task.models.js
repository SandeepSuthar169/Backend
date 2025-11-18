import mongoose, {Schema} from "mongoose";
import { AvailableTaskStatuses, TaskStatusEnum } from "../utils/constants.js";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },        
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
            // required: [true, "Project ref is requires"]
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            // required: true,
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: AvailableTaskStatuses,
            default: TaskStatusEnum.TODO
        },
        attachments: {
            type: [
                {
                    url: String,
                    mimetype: String, 
                    //mimetype :-> png, jpg, JPEG, SVG....
                    size: Number
                }
            ],
            default: []
        }

}, {timestamps: true})

export const Task = mongoose.model("Task", taskSchema)

