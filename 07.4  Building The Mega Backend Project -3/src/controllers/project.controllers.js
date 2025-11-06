import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { ProjectMember } from "../models/projectmember.models.js"
import { User } from "../models/user.models.js"
import { Project } from "../models/project.models.js"
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";
import mongoose, { Mongoose } from "mongoose";





const getProjects = asyncHandler(async (req, res) => {
        const project = await ProjectMember.aggregate([
            {
                $match: {
                    user: req.user._id
                }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "project",
                    foreignField: "_id",
                    as: "project",
                    pipeline: [
                       { 
                        $lookup: {
                            from: "projectmembers",
                            localField: "_id",
                            foreignField: "project",
                            as: "projectmembers"
                        }}
                    ]
                }
            },
            {
                $addFields: {
                    members: {
                        $size: "$projectmembers"
                    }
                }
            },
            {
                $unwind: "$project"
            },
            {
                $project: {
                    project: {
                        _id: 1,
                        name: 1,
                        description: 1,
                        members: 1,
                        createdAt: 1,
                        createdBy: 1,
                    },
                    role: 1,
                    _id: 0

                }
            }

        ]);

        if(!project) throw new ApiError(404, "Project is required!")
        console.log(project);
        

        return res.status(200).json(
            new ApiResponse(
                200,
                project,
                "project fetched successfully"
            )
        )
});


const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    const proiect = await Project.findById(projectId)

    if(!proiect)  throw new ApiError(401, "project not found")

    return res.status(200).json(
        new ApiResponse(
            200,
            proiect,
            "project fetch successfully!"

            
        )
    )

});

`                 `
const createProject = asyncHandler(async (req, res) => {

    const { name, description } = req.body

    const { projectId } = req.params

    const project = await Project.create({
        name,
        description,
        createdBy: req.user._id
    })

    if(!project)  throw new ApiError(404, "Project not found" )

    await ProjectMember.create({
        user: req.user._id,
        project: projectId,
        role: UserRolesEnum.ADMIN
    })
    
    return res.status(200).json(new ApiResponse(200, project, "Project create successfully"))


});

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    const { name, description } = req.body

    if(!projectId)  throw new ApiError(404, "Project Id is required")


    if(!name || !description)  throw new ApiError(404, "User info is required")

    const existingProject = await Project.findById(projectId)

    if(existingProject) throw new ApiError(404, "existing project not found")

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name, description
        },
        {
            new: true
        }
    )

    if(!project)  throw new ApiError(401, "Project not found")

    return res.status(200).json(new ApiResponse(200, project, "project update successfully"))

});


const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if(!projectId)  throw new ApiError(404, "Project Id is required")


    const delProject = await Project.findByIdAndDelete(projectId)

    if(!delProject)  throw new ApiError(404, "project delete not found")

    return res.status(200,
        new ApiResponse(200, "project delete successfully")
    )

});

const addMemberToProject = asyncHandler(async (req, res) => {
    const { email, username, role} = req.body
    
    if(!email || !username || !role){
        throw new ApiError(404, "User info is required")
    }
    
    const { projectId } = req.params
    
    if(!projectId){
        throw new ApiError(404, "Project Id is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "Project Id is required")
    }

    await ProjectMember.findOneAndUpdate(
        {
            user: user._id,
            project:  projectId,
            role: role
        },
        {
            new: true
        }
    );

    return res.status(201).json(
        new ApiResponse(
            201,
        "Project member added successfully" 
        )
    )




});

const getProjectMembers = asyncHandler(async (req, res) => {
    const projectId = req.params
    const projectMembers = await ProjectMember.find({projectId}).populate({
        path: "user",
        select: "username fullName avatar"
    }).select("project user role createdAt updateAt -_id")

    if(!projectMembers){
        throw new ApiError(404, "Project member is required")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
        projectMembers,
        "project member fetch successfully")
    )

});

const updateProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if(!projectId)  throw new ApiError(404, "Project member is required")

    const projectMembers = await ProjectMember.find({projectId})
    
    if(!projectMembers)  throw new ApiError(404, "Project member is required")

    const { email, username, role } = req.body

    const user = User.findOne({
        $or: [{email}, username]
    })

    if(!user)  throw new ApiError(404, "user is required")


    const updateProjectMember =  await ProjectMember.findOneAndUpdate(
        {
            user: new mongoose.Types.ObjectId(req.user._id),
            project:  new Mongoose.Types.ObjectId(projectId),
            role: role
        },
        {
            new: true
        }
    );

    if(!updateProjectMember){
        throw new ApiError(404, "user is required")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Project member update successfully"
        )
    )

    
});


const updateMemberRole = asyncHandler(async (req, res) => {
    const { newRole, projectId, userId } = req.body

    if(!newRole || !projectId || !userId){
        throw new ApiError(404, "project member info is  required")
    }
    
    if(!AvailableUserRoles.includes(newRole)){
        throw new ApiError(401, "Invalid role")
    }

    const projectmember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(req.user._id),
    })

    if(!projectmember){
        throw new ApiError(404, "project member is required")
    }

    ProjectMember.role = newRole

    await ProjectMember.save({ velidateBeforeSave: true })
    
    return res.status(200).json(new ApiResponse(
        200,
        {
            role: ProjectMember.newRole,
            project: ProjectMember.project,
            user: ProjectMember.user,
        }
    ))
});


const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.body

    if( !projectId || !userId){
        throw new ApiError(404, "project member info is  required")
    }

    const projectmember = await ProjectMember.findOne({
        project: projectId,
        user: userId
    })

    if(!projectmember){
        throw new ApiError(404, "project member is required")
    }

    const delProjectMember = await ProjectMember.findByIdAndDelete(projectmember._id)

    if(!delProjectMember){
        throw new ApiError(404, "delete Project member is required")
    }

    return res.status(201).json(
        new ApiResponse(201,
            delProjectMember,    
            "delete project member successfully")
    )

});

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMemberToProject,
    getProjectMembers,
    updateMemberRole,
    updateProjectMembers,
    deleteMember
}