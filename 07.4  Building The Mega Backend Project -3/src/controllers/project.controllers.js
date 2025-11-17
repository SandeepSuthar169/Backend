import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { ProjectMember } from "../models/projectmember.models.js"
import { User } from "../models/user.models.js"
import { Project } from "../models/project.models.js"
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

import mongoose, { Mongoose } from "mongoose";




const createProject = asyncHandler(async (req, res) => {

    const { name, description } = req.body
    if(!name || !description) throw new ApiError(401, "project info is required")

    const { userId } =  req.params 
    if(!userId) throw new ApiError(401, "user id is required")

    const user = await User.findById(userId)
    if(!user) throw new ApiError(401, "user  is required")

    const project = await Project.create({
        name,
        description,
        createdBy: user._id
    })

    if(!project)  throw new ApiError(404, "Project not found" )


    
    return res.status(200).json(new ApiResponse(200, project, "Project create successfully"))


});


const createProjectMenbers = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    if(!projectId) throw new ApiError(401, "user id is required")

    const { userId } =  req.params 
    if(!userId) throw new ApiError(401, "user id is required")

    const user = await User.findById(userId)
    if(!user) throw new ApiError(401, "user  is required")

    const { role } = req.body
    if(!role) throw new ApiError(401, "role  is required")

    if(!Object.values(UserRolesEnum).includes(role)) throw new ApiError(401, "User role is required")

    const projectMenbers = await ProjectMember.create({
        user: user._id,
        project: projectId,
        role: "project_admin"
    })
    console.log(projectMenbers);
    
    if(!projectMenbers) throw new ApiError(401, "project member  is required")

    return res.status(200).json(
        new ApiResponse(
            200,
            projectMenbers,
            "project member fetch successfully!"    
        )
    )
})

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



const getProjects = asyncHandler(async (req, res) => {

    console.log("req.user:", req.user);
    console.log("req.user._id:", req.user?._id);
        const project = await ProjectMember.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user._id)
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
                            }
                        },
                        {
                            $addFields: {
                                members: {
                                    $size: "$projectmembers"
                                }
                            }
                        }
                    ]
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
        console.log(project);

        if(!project) throw new ApiError(404, "Project is required!")
        

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    project
                },
                "project fetched successfully"
            )
        )
});



const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    const { name, description } = req.body
    
    // console.log("project Id  ==>>", projectId);
    // console.log("project name  ==>>", name);
    // console.log("project description  ==>>", description);
    
    if(!projectId)  throw new ApiError(404, "Project Id is required")


    if(!name || !description)  throw new ApiError(404, "User info is required")

    const existingProject = await Project.findById(projectId)

    if(!existingProject) throw new ApiError(404, "existing project not found")

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
    console.log("User ID:+=+=+=>", req.user._id);

    console.log("project ID:+=+=+=>",projectId);
    

    if(!projectId)  throw new ApiError(404, "Project Id is required")

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid Project ID format");
    }

    const project = await Project.findById(projectId);
    console.log("Found in Project collection:", project);

    // const projectExists = await Project.findById(projectId);
    // console.log("Project exists:", projectExists);
    
    // if(!projectExists) {
    //     throw new ApiError(404, "Project not found");
    // }

    const delProject = await Project.findOneAndDelete({ _id: projectId })
    console.log(projectId);  

    console.log(delProject);
    

    if(!delProject)  throw new ApiError(404, "project delete not found")

    return res.status(200,
        new ApiResponse(200, {deleteProject}, "project delete successfully")
    )

});


const addMemberToProject = asyncHandler(async (req, res) => {
    const { email, username, role} = req.body
    console.log(email);
    console.log(username);
    console.log(role);
    
    
    if(!email || !username || !role){
        throw new ApiError(404, "User info is required")
    }
    
    const { projectId } = req.params
    console.log(projectId);
    
    
    if(!projectId){
        throw new ApiError(404, "Project Id is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    console.log(user._id);
    

    if(!user){
        throw new ApiError(404, "Project Id is required")
    }

    const projectMember = await ProjectMember.create({
        user: user._id,
        project: projectId,
        role: role
    });

    console.log("Created project member:", projectMember);
    
    
    if(!projectMember){
        throw new ApiError(404, "projectMember is required")
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            projectMember,
            "Project member added successfully" 
        )
    )
});



const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectMemberId } =  req.params
    if(!projectMemberId)  throw new ApiError(404, "projectMamabersId Id not found")

    const projectMembers = await ProjectMember.findById(projectMemberId).populate({
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

    const projectMembers = await ProjectMember.findById(projectId)
       
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
            updateProjectMember,
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
    const { projectMemberId } = req.params

    


    if(!projectMemberId){
        throw new ApiError(404, "project id is required")
    }

    const delProjectMember = await ProjectMember.findByIdAndDelete(projectMemberId)

    if(!delProjectMember){
        throw new ApiError(404, "delete Project member is required")
    }

    return res.status(201).json(
        new ApiResponse(201,
            {
                delProjectMember
            },    
            "delete project member successfully")
    )

});

export {
    getProjects,
    getProjectById,
    createProjectMenbers,
    createProject,
    updateProject,
    deleteProject,
    addMemberToProject,
    getProjectMembers,
    updateMemberRole,
    updateProjectMembers,
    deleteMember
}