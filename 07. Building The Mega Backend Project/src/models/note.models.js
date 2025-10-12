import mongoose, { Schema } from "mongoose";

const projectNoteSchema = new Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        createBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
    }, 
    {timestamps: true}
)

export const ProjectNote = mongoose.model("ProjectNOte",  projectNoteSchema);

 