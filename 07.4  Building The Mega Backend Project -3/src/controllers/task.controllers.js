import mongoose from "mongoose"
import { Task }  from "../models/task.models.js"
import { User } from "../models/user.models.js"
import { SubTask } from "../models/subtask.modes.js"
import { Project } from "../models/project.models.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import { AvailableTaskStatuses, AvailableUserRoles } from "../utils/constants.js"



const createTask = asyncHandler(async(req, res) =>{
    //1. find project
    const { title, description, status, assignedTo } = req.body
    console.log(title);
    console.log(description);
    console.log(status);
    // console.log(assignedTo );
    if(!title || !description || !status)  throw new ApiError(404, "user info not found!")
    
    
    const { userId } =  req.params 
    console.log(userId);
    
    if(!userId) throw new ApiError(401, "user id is required")

    const user = await User.findById(userId)
    if(!user) throw new ApiError(401, "user  is required")


    const { projectId } = req.params
    console.log(projectId);
    
    if(!projectId) throw new ApiError(401, "projectId  is required")

    const  project  = await Project.findById(projectId)
    if(!project)  throw new ApiError(404, "project not found!")
    //3. get the files form req.files

    // const files = req.files || []

    // if(!files)  throw new ApiError(404, "files not found!")
    // //4. create affachments

    // const attachments = files.map((file) => {
    //     return {
    //         url: `${process.env.BASE_URL}/images/${file.filename}`,
    //         mimetype: file.mimetype,
    //         size: file.size
    // }
    // })

    // if(!attachments) throw new ApiError(404, "files not found!")
    // //5. create task

    const task = await Task.create({
        title,
        description,
        project: projectId,
        assignedBy: user._id,
        assignedTo: user._id,
        status,
        // attachments
    })

    if(!task) throw new ApiError(404, "failed to ceate task")
    //6. return successfully

    return res.status(201).json(new ApiResponse(201, task, "task create successfully"))
})



const getAllTasks = asyncHandler(async(req, res) =>{
    const { projectId } = req.params
    const project = await Project.findById(projectId)

    if(!project)  throw new ApiError(401, "project not found")

    const task = await Task.aggregate([
      {
        $match: {
            project: new mongoose.Types.ObjectId(projectId)
        } 
    },
    {
        $lookup: {
            from: "users",
            localField: "assignedTo",
            foreignField: "_id",
            as: "assignedTo"
        }
    },
    {
        $unwind: {
            path: "$assignedTo",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            title: 1,
            description: 1,
            project: 1,
            assignedBy: 1,
            status: 1,
            attachments: 1,
            assignedTo: {
                _id: 1,
                avatar: 1,
                username: 1,
                fullName: 1
            }
        }
    }
    ])

    if(!task || task.length === 0) throw new ApiError(404, "Tasks not found")

    return res.status(200).json(
        new ApiResponse(200,
            task,
            "task fetched successfully"
        )
    )
})


const getTasksById = asyncHandler(async(req, res) =>{
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
        if(!task)  throw new ApiError(404, "task not found!")

    //4. return successfully 
        return res.status(200).json(
            new ApiResponse(
                200, 
                task, 
                "task fatched successfully"
          ))
})


const updateTask = asyncHandler(async(req, res) =>{
    const { title, description, status, assignedTo} = req.body

    if(!title || !description || !status){
        throw new ApiError(404, "user info not found!")
    }
    const {taskId} = req.params

    
    const  task  = await Task.findById(taskId)


    if(!taskId) throw new ApiError(404, "task not found!")


    // const files = req.files || []

    // if(!files)  throw new ApiError(404, "files not found!")
    // //4. create affachments

    // const attachments = files.map((file) => {
    //     return {
    //         url: `${process.env.BASE_URL}/images/${file.originalname}`,
    //         mimetype: file.mimetype,
    //         size: file.size
    //     }
    // })

    // if(!attachments)  throw new ApiError(404, "files not found!")

    if(title)  task.title = title
    
    if(description)  task.description = description
    
    if(status)  task.status = status
    
    if(status)  task.status = status
    
    if(assignedTo)  task.assignedTo = assignedTo
    
    // if(attachments.length > 0)  task.attachments.push(...attachments)

    await task.save({validateBeforeSave: true})

    const updateTask = await Task.findById(task._id)
        .populate("assignedTo", "username fullName")
        .populate("assignedBy",  "fullName username")


    return res.status(200).json(new ApiResponse(
      200,
      updateTask,
      "update task successfully"
    ))
})



const deleteTask = asyncHandler(async(req, res) =>{
    //1. task get by taskId
    const { taskId } = req.params
    if(!taskId) throw new ApiError(401, "taskId not found")
    //2. validate task

    //3. delete task by taskId
    const deleTask = await Task.findOneAndDelete(taskId)
    
    //4. validate delete task
    if(!deleTask) throw new ApiError(401, "delete task not success")
    //5. return success

    return res.status(200).json(new ApiResponse(
      200, 
      deleTask, 
      "delete task successfully"
    ))
})


const createSubTask = asyncHandler(async(req, res) =>{
    //1. get subTask info by req.body
    const { title } = req.body
    if(!title) throw new ApiError(404, "title is required")
    
      
    const { userId } =  req.params 
    if(!userId) throw new ApiError(401, "user id is required")
      
    const user = await User.findById(userId)
    if(!user) throw new ApiError(401, "user  is required")
      
    const { taskId } = req.params
    if(!taskId) throw new ApiError(404, "title is required")
    //2. find task by taskId

    const task = await Task.findById(taskId)
    if(!task)  throw new ApiError(404, "title is required")

    //3. crate subTask

    const subTask = await SubTask.create({
        title,
        task: new mongoose.Types.ObjectId(taskId),
        createdBy: new mongoose.Types.ObjectId(user._id)
    })
    //4. validate fileds
    if(!subTask) throw new ApiError(403, "subTask not create")
    //5. return success

    return res.status(200).json(new ApiResponse(
        200,
        subTask,
        "subTask create successfully"
    ))
})

const getSubTask = asyncHandler(async(req, res) => {
    //1. find taskId useing req.params
    const { taskId } = req.params

    if(!taskId) throw new ApiError(401, "taskId not found")
    //2. subtask aggregation pipeline
    const subtask = SubTask.aggregate([
      {
        $match: {
            task: new mongoose.Types.ObjectId(taskId)  // FIX: Must be an object with field name
        }
    },
    {
        $lookup: { 
            from: "users",
            localField: "createdBy",  
            foreignField: "_id",
            as: "createdBy"
        }
    },
    {
        $unwind: {  
            path: "$createdBy",
        }
    },
    {
        $project: {  
            title: 1,
            description: 1,
            status: 1,
            task: 1,
            createdAt: 1,
            updatedAt: 1,
            "createdBy._id": 1,
            "createdBy.username": 1,
            "createdBy.avatar": 1,
            "createdBy.fullName": 1
        }
    },
    {
        $sort: {
            createdAt: -1  
        }
    }
    ])
    
    //3. validate
    if(!subtask) throw new ApiError(401, "subTask not found")

    //4. return
    return res.status(200).json(
      new ApiResponse(
        200,
        subtask,
        "subTask fetch successfully"

      )
    )
})



const updateSubTask = asyncHandler(async(req, res) =>{
  
    const { subTaskId  } =  req.params 
    if(!subTaskId ) throw new ApiError(401, "user id is required")

    const subTask  = await SubTask.findById(subTaskId )
    if(!subTask ) throw new ApiError(401, "subTask   is required")

    const {title, isCompleted} = req.body
    if(!title || !isCompleted) throw new ApiError(401, "subTask info is required")

    if(title) subTask.title = title
      
    if(isCompleted !== undefined) subTask.isCompleted = isCompleted

    await subTask.save({ validateBeforeSave: true })
    
    const updateSubTask = await SubTask.findById(subTaskId)
                .populate("createdBy", "_id username fullname")
                .populate("task", "_id titke")


    if(!updateSubTask) throw new ApiError(401, "updateSubTask not found")

    return res.status(200).json(new ApiResponse(
      200,
      updateSubTask,
      "subTask update successfully"
    ))


})



const deleteSubTask = asyncHandler(async(req, res) =>{
  const { subTaskId } = req.params

  if(!subTaskId) throw new ApiError(401, "subTaskId not found")

  const delSubTask = await SubTask.findByIdAndDelete(subTaskId)

  if(!delSubTask) throw new ApiError(401, "subTaskId not found")

    return res.status(200).json(new ApiResponse(
      200,
      delSubTask,
      "subTask delete successfully"
    ))


})

export{
    createTask,
    getAllTasks,
    getTasksById,
    updateTask,
    deleteTask,
    getSubTask,
    createSubTask,
    updateSubTask,
    deleteSubTask,
}