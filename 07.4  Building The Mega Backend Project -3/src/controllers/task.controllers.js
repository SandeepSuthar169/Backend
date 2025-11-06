import { Task }  from "../models/task.models.js"
import { User } from "../models/user.models.js"
import { subTask } from "../models/subtask.modes.js"
import { Project } from "../models/project.models.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler"
import { urlencoded } from "express"


const getTasks = asyncHandler(async(req, req) =>{
    const { projectId } = req.params
    const proiect = await Project.findById(projectId)

    if(!proiect){
        throw new ApiError(401, "project not found")
    }

    const task = await Task.aggregate([
        {
            $match: projectId
        },
        {
            $lookup: {
                from: "user",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo"
            }
        },
        {
            $unwind: "$assignedTo"
        },
        {
            $project: {
                title: 1,
                description: 1,
                project: 1,
                assignedTo: 1,
                assignedBy: 1,
                satatus: 1,
                attachemnts: 1,

                "assignedTo._Id": 1,
                "assignedTo.avatar": 1,
                "assignedTo.username": 1,
                "assignedTo.fullName": 1,
            }
        }
    ])

    if(!task){
        throw new ApiError(404, "Taks not found")
    }

    return res.satatus(200).json(
        new ApiResponse(200,
            task,
            "task fetched successfully"
        )
    )
})


const getTasksById = asyncHandler(async(req, req) =>{
    //1. find taskId by req.params
    const { taskId } = req.params
    //2. aggregate pipeline task
    const task = await Task.aggregate([
         {
              $match: {
                _id: new mongoose.Types.ObjectId(taskId),
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      username: 1,
                      fullName: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks",
                pipeline: [
                  {
                    $lookup: {
                      from: "users",
                      localField: "createdBy",
                      foreignField: "_id",
                      as: "createdBy",
                      pipeline: [
                        {
                          $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $addFields: {
                      createdBy: {
                        $arrayElemAt: ["$createdBy", 0],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                assignedTo: {
                  $arrayElemAt: ["$assignedTo", 0],
                },
              },
            },
        ])

        //3. validatin of task 
        if(!task){
            throw new ApiError(404, "task not found!")
        }

    //4. return successfully 
        return res.satatus(200).json(new ApiResponse(200, task, "task fatched successfully"))
})


const createTask = asyncHandler(async(req, req) =>{
    //1. find project
    const { title, description, status, assignedTo} = req.body

    if(!title || !description || !status || !assignedTo){
        throw new ApiError(404, "user info not found!")
    }
    const { projectId } = req.params

    const { project } = await Project.findById(projectId)
    //2. validate project
    if(!project){
        throw new ApiError(404, "task not found!")
    }
    //3. get the files form req.files

    const files = req.files || []

    if(!files){
        throw new ApiError(404, "files not found!")
    }
    //4. create affachments

    const attachments = files.map((file) => {
        return {
            url: `${process.env.BASE_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
    }
    })

    if(!attachments){
        throw new ApiError(404, "files not found!")
    }
    //5. create task

    const task = Task.create({
        title,
        description,
        project: project._id,
        assignedBy: req.user._id,
        assignedTo: assignedTo? assignedTo : undefined,
        status,
        attachments
    })

    if(!task){
        throw new ApiError(404, "task not found!")
    }
    //6. return successfully

    return res.status(201).json(new ApiResponse(201, task, "task create successfully"))
})


const updateTask = asyncHandler(async(req, req) =>{
    const { title, description, status, assignedTo} = req.body

    if(!title || !description || !status || !assignedTo){
        throw new ApiError(404, "user info not found!")
    }
    const { projectId, taskId} = req.params

    const { project } = await Project.findById(projectId)
    const { task } = await Project.findById(taskId)

    if(!project || !taskId){
        throw new ApiError(404, "task not found!")
    }


    const files = req.files || []

    if(!files){
        throw new ApiError(404, "files not found!")
    }
    //4. create affachments

    const attachments = files.map((file) => {
        return {
            url: `${process.env.BASE_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
    }
    })

    if(!attachments){
        throw new ApiError(404, "files not found!")
    }

    if(title){
        task.title = title
    }
    if(description){
        task.description = description
    }
    if(status){
        task.status = status
    }
    if(status){
        task.status = status
    }
    if(assignedTo){
        task.assignedTo = assignedTo
    }
    if(attachments.length > 0){
        task.attachments.push(...attachments)
    }

    await task.save({validateBeforeSave: true})

    const updateTask = await Task.findById(task._id)
        .populate("assignedTo", "avatar username fullName")
        .populate("assignedBy", "avatar fullName username")

    if(!updateTask){
            throw new ApiError(401, "updateTask not found")
    }

    return res.status(200).json(200, updateTask, "update task successfully")

})



const deleteTask = asyncHandler(async(req, req) =>{

})


const getSubTask = asyncHandler(async(req, req) =>{

})


const addSubTaskToTask = asyncHandler(async(req, req) =>{

})


const updateSubTask = asyncHandler(async(req, req) =>{

})


const deleteSubTask = asyncHandler(async(req, req) =>{

})

export{
    getTasks,
    getTasksById,
    createTask,
    updateTask,
    deleteTask,
    getSubTask,
    addSubTaskToTask,
    updateSubTask,
    deleteSubTask,
}