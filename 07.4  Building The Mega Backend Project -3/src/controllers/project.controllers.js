import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { ProjectMember } from "../models/projectmember.models.js"
import { User } from "../models/user.models.js"
import { Project } from "../models/project.models.js"






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

        if(!project){
            throw new ApiError(404, "Project is required!")
        }
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

    if(!proiect){
        throw new ApiError(401, "project not found")
    }

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

    const project = await Project.create({
        name,
        description,
        createdBy: req.user._id
    })

    if(!project){
        throw new ApiError(404, "Project not found" )
    }
    
    return res.status(200).json(new ApiResponse(200, project, "Project create successfully"))


});

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { name, description } = req.body

    const existingProject = Project.findById(projectId)

    if(existingProject){
        throw new ApiError(404, "existing project not found")
    }

    const project = Project.findByIdAndUpdate(
        projectId,
        {
            name, description
        },
        {
            new: true
        }
    )

    if(!project){
        throw new ApiError(401, "Project not found")
    }

    return res.status(200).json(new ApiResponse(200, project, "project update successfully"))

});


const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    const delProject = Project.findByIdAndDelete(projectId)

    if(!delProject){
        throw new ApiError(404, "project delete not found")
    }

    return res.status(200,
        new ApiResponse(200, "project delete successfully")
    )

});

const addMemberToProject = asyncHandler(async (req, res) => {


});

const getProjectMembers = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

});

const updateProjectMembers = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

});


const updateMemberRole = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

});


const deleteMember = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

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