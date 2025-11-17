import mongoose from "mongoose"
import { Task }  from "../models/task.models.js"
import { User } from "../models/user.models.js"
import { subTask } from "../models/subtask.modes.js"
import { Project } from "../models/project.models.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler"
import { AvailableTaskStatuses, AvailableUserRoles } from "../utils/constants"



const createTask = asyncHandler(async(req, res) =>{
    //1. find project
    const { title, description, status, assignedTo} = req.body

    if(!title || !description || !status || !assignedTo)  throw new ApiError(404, "user info not found!")
    const { projectId } = req.params

    const { project } = await Project.findById(projectId)
    //2. validate project
    if(!project)  throw new ApiError(404, "task not found!")
    //3. get the files form req.files

    const files = req.files || []

    if(!files)  throw new ApiError(404, "files not found!")
    //4. create affachments

    const attachments = files.map((file) => {
        return {
            url: `${process.env.BASE_URL}/images/${file.filename}`,
            mimetype: file.mimetype,
            size: file.size
    }
    })

    if(!attachments) throw new ApiError(404, "files not found!")
    //5. create task

    const task = await Task.create({
        title,
        description,
        project: project._id,
        assignedBy: req.user._id,
        assignedTo: assignedTo? assignedTo : undefined,
        status,
        attachments
    })

    if(!task) throw new ApiError(404, "failed to ceate task")
    //6. return successfully

    return res.status(201).json(new ApiResponse(201, task, "task create successfully"))
})



const getTasks = asyncHandler(async(req, req) =>{
    const { projectId } = req.params
    const proiect = await Project.findById(projectId)

    if(!proiect)  throw new ApiError(401, "project not found")

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

    if(!task)  throw new ApiError(404, "Taks not found")

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
        if(!task)  throw new ApiError(404, "task not found!")

    //4. return successfully 
        return res.satatus(200).json(new ApiResponse(200, task, "task fatched successfully"))
})


const updateTask = asyncHandler(async(req, req) =>{
    const { title, description, status, assignedTo} = req.body

    if(!title || !description || !status || !assignedTo){
        throw new ApiError(404, "user info not found!")
    }
    const { projectId, taskId} = req.params

    const { project } = await Project.findById(projectId)
    
    const { task } = await Project.findById(taskId)


    if(!project || !taskId) throw new ApiError(404, "task not found!")


    const files = req.files || []

    if(!files)  throw new ApiError(404, "files not found!")
    //4. create affachments

    const attachments = files.map((file) => {
        return {
            url: `${process.env.BASE_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
        }
    })

    if(!attachments)  throw new ApiError(404, "files not found!")

    if(title)  task.title = title
    
    if(description)  task.description = description
    
    if(status)  task.status = status
    
    if(status)  task.status = status
    
    if(assignedTo)  task.assignedTo = assignedTo
    
    if(attachments.length > 0)  task.attachments.push(...attachments)

    await task.save({validateBeforeSave: true})

    const updateTask = await Task.findById(task._id)
        .populate("assignedTo", "avatar username fullName")
        .populate("assignedBy", "avatar fullName username")

    if(!updateTask)  throw new ApiError(401, "updateTask not found")

    return res.status(200).json(200, updateTask, "update task successfully")

})



const deleteTask = asyncHandler(async(req, req) =>{
    //1. task get by taskId
    const { taskId } = req.params
    if(!taskId) throw new ApiError(401, "taskId not found")
    //2. validate task


    //3. delete task by taskId

    const deleTask = await Task.findOneAndDelete(taskId)
    
    //4. validate delete task
    if(!deleTask) throw new ApiError(401, "delete task not success")
    //5. return success

    return res.status(200).json(new ApiResponse(200, deleTask, "delete task successfully"))
})


const createSubTask = asyncHandler(async(req, req) =>{
    //1. get subTask info by req.body
    const { title } = req.body

    if(!title) throw new ApiError(404, "title is required")
    const { taskId } = req.params

    if(!taskId) throw new ApiError(404, "title is required")
    //2. find task by taskId

    const task = await Task.findById(taskId)

    if(!task)  throw new ApiError(404, "title is required")

    //3. crate subTask

    const subTask = await subTask.create({
        title,
        task: new mongoose.Types.ObjectId(task._id),
        createdBy: new mongoose.Types.ObjectId(req.user._id)
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

const getSubTask = asyncHandler(async(req, req) => {
    //1. find taskId useing req.params
    const { taskId } = req.params

    if(!taskId) throw new ApiError(401, "taskId not found")
    //2. subtask aggregation pipeline
    const subtask = subTask.aggregate([
      {
        $match: new mongoose.Types.ObjectId(taskId)
      },
      {
        from: "users",
        localField: "createBy",
        foreignField: "_id",
        as: "createBy",
        project: [
          {
            $project: {
              _id: 1,
              username: 1,
              avatar: 1,
              fullName: 1
            }
          }
        ]
      },
      {
        $addFields: {
          createBy: {
            $arrayElemAt: ["$createby", 0]
          }
        }
      },
      {
        $sort: {
          createby: -1
        }
      }
    ])
    
    //3. validate
    if(!subtask) throw new ApiError(401, "subTask not found")

    //4. return
    return res.status(200).json(
      new ApiResponse(
        200,
        subTask,
        "subTask fetch successfully"

      )
    )
})



const updateSubTask = asyncHandler(async(req, req) =>{
    const {title, isCompleted} = req.body

    if(!title || !isCompleted) throw new ApiError(401, "subTask info is required")

    const { taskId } = req.params

    if(!taskId) throw new ApiError(401, "subTask info is required")

    const { task } = await Task.findById(taskId)

    if(!task) throw new ApiError(401, "subTask info is required")

    const subTask = await subTask.findOneAndUpdate(
      {
        title,
        task: new mongoose.Types.ObjectId(taskId),
        isCompleted,
        createBy: new mongoose.Types.ObjectId(req.user._id)
      }
    )

    if(!subTask) throw new ApiError(401, "subTask not found")

    return res.status(200).json(new ApiResponse(
      200,
      subTask,
      "subTask update successfully"
    ))


})



const deleteSubTask = asyncHandler(async(req, req) =>{
  const { subTaskId } = req.params

  if(!subTaskId) throw new ApiError(401, "subTaskId not found")

  const delSubTask = await subTask.findByIdAndDelete(subTaskId)

  if(!delSubTask) throw new ApiError(401, "subTaskId not found")

    return res.status(200).json(new ApiResponse(
      200,
      "subTask delete successfully"
    ))


})

export{
    createTask,
    getTasks,
    getTasksById,
    updateTask,
    deleteTask,
    getSubTask,
    createSubTask,
    updateSubTask,
    deleteSubTask,
}