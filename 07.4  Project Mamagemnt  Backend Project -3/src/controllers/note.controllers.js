import mongoose from "mongoose"
import { User } from "../models/user.models.js"
import { Project } from "../models/project.models.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { ProjectNote } from "../models/note.models.js"
import { asyncHandler } from "../utils/async-handler.js"
import { compare } from "bcryptjs"
 

const createNote = asyncHandler(async(req, res) => {
    const { projectId } = req.params 
    if(!projectId) throw new ApiError(401, "project id is required")
    
    const { content } = req.body
    if(!content) throw new ApiError(401, "content is required")
    
    const project = await Project.findById(projectId)
    if(!project) throw new ApiError(404, "project not found")
    
    const { userId } =  req.params 
    if(!userId) throw new ApiError(401, "user id is required")

    const user = await User.findById(userId)
    if(!user) throw new ApiError(401, "user is required")
    
    const note = await ProjectNote.create({
        project: projectId,
        content: content,
        createdBy: user._id
    })
    console.log(note);
    
    if(!note) throw new ApiError(401, "note is required")
    
    return res.status(200).json(
        new ApiResponse(
            200, 
            {
                note
            }, 
            "Note created successfully"
    ))
});
const getNotes = asyncHandler(async(req, res) => {
    const { projectId } = req.params

    const project = await Project.findById(projectId)    

    if(!project){
        throw new ApiError(404, "project not found")
    }

    const note = await ProjectNote.find({
        project: projectId

    }).populate("createdBy", "username fullName avatar")

    if(!note){
        throw new ApiError(404, "project note not found")
    }


    return res
        .status(200)
        .json(new ApiResponse(
            200,
            note, 
            "Notes fetched successfully" 
        ))
})

const getNotesById = asyncHandler(async(req, res) => {

    const { noteId } = req.params

    const note = await ProjectNote.findById(noteId).populate("createdBy", "username fullname avatar")

    if(!note){
        throw new ApiError(404, "note not found")
    }

    return res.status(200).json(new ApiResponse(
        200, 
        note, 
        "Note fectch successfully"
    ))

})


const updateNote = asyncHandler(async(req, res) => {
    const { noteId } = req.params
    console.log(noteId);
    
    const { content } = req.body
    console.log(content);


    const existingNote = ProjectNote.findById(noteId)
    console.log(existingNote);
    

    if(!existingNote){
        throw new ApiError(404, "exisiting note not found")
    }

    const note = await ProjectNote.findByIdAndUpdate(
        noteId,
        {
            content
        },
        {
            new: true
        }
    ).populate("createdBy", "username fullname avatar")

    return res.status(200).json(new ApiResponse(
        200, 
        note, 
        "update successfully"
    ))

})


const deleteNote = asyncHandler(async(req, res) => {
    const { noteId } = req.params
    
    const delNote  = await ProjectNote.findByIdAndDelete(noteId)

    if(!delNote){
        throw new ApiError(404, "note delete not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200, 
            delNote, 
            "delete not successfully"
    ))


})

export { 
    getNotes, 
    getNotesById, 
    createNote, 
    updateNote, 
    deleteNote 
}

