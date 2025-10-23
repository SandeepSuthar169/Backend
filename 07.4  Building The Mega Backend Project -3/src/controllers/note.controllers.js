import mongoose from "mongoose"
import { Project } from "../models/project.models.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"

const getNotes = async(req, res) => {
    const { projectId } = req.params

    const project = await Project.findById(projectId)      // Project -> mongoose

    if(!project){
        throw new ApiError(404, "project not found")
    }

    const note = await ProjectNote.find({
        project: mongoose.Types.ObjectId(projectId)

    }).populate("createdBy", "username fullName avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, "Notes fetched successfully" ))
}

const getNotesById = async(req, res) => {

}

const createNote = async(req, res) => {

}

