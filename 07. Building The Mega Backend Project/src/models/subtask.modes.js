import mongoose, {Schema} from "mongoose";

const subtaskSchema = new Schema({})

export const SubTask = mongoose.model("SubTask", subtaskSchema)

