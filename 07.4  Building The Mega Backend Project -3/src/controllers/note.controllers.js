import mongoose from "mongoose"
import { Project } from "../models/project.models.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { ProjectNote } from "../models/note.models.js"
import { asyncHandler } from "../utils/async-handler.js"
 
const getNotes = async(req, res) => {
    const { projectId } = req.params

    const project = await Project.findById(projectId)      // Project -> mongoose

    if(!project){
        throw new ApiError(404, "project not found")
    }

    const note = await ProjectNote.find({
        project: projectId

    }).populate("createdBy", "username fullName avatar")

    if(!note){
        throw new ApiError(404, "project note not found ")
    }


    return res
        .status(200)
        .json(new ApiResponse(200, "Notes fetched successfully" ))
}

const getNotesById = async(req, res) => {

    const { noteId } = req.params

    const note = ProjectNote.findById(noteId).populate("createdBy", "username fullname avatar")

    if(!note){
        throw new ApiError(404, "note not found")
    }

    return res.status(200).json(new ApiResponse(200, note, "Note fectch successfully"))

}

const createNote = async(req, res) => {
    const { projectId } = req.params
    const { content } = req.body

    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError("404", "project not fount")
    }

    const note = ProjectNote.create({
        project: projectId,
        content,
        createdBy: req.user._id
    })

    const populatedNote =await ProjectNote.findById(note._id).populate("createdBy", "username fullname avatar")

    return res.status(200).json(new ApiResponse(200, populatedNote, "Note created successfully"))
}

const updateNote = async(req, res) => {
    const { noteId } = req.params
    const { content } = req.body

    const existingNote = ProjectNote.findById(noteId)

    if(!existingNote){
        throw new ApiError(404, "exisiting note not found")
    }

    const note = ProjectNote.findByIdAndUpdate(
        noteId,
        {content},
        {new: true}
    ).populate("createdBy", "username fullname avatar")

    return res.status(200).json(new ApiResponse(200, note, "update successfully"))

}


const deleteNote = async(req, res) => {
    const { noteId } = req.params
    
    const delNote  = ProjectNote.findByIdAndDelete(noteId)

    if(!delNote){
        throw new ApiError(404, "note delete not found")
    }

    return res.status(200).json(new ApiResponse(200, delNote, "delete not successfully"))


}

export { getNotes, getNotesById, createNote, updateNote, deleteNote }

