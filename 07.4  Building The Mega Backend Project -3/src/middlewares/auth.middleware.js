import mongoose from "mongoose";
import { jwt } from "jsonwebtoken";
import { User } from "../models/user.models.js"
import { ApiError} from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { ProjectMember } from "../models/projectmember.models.js";

export const verityJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!token){
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(token,
            process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
  
            if(!user){
                throw new ApiError(401, "Invalid access token")
            }

        
            req.user = user
            next()
    
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})


export const validateProjectPermission = (roles = []) => 
    asyncHandler(async (req, res, next) => {
        const { projectId } = req.params

        if(!projectId){
            throw new ApiError(401,  "invalid project Id ")
        }

        const project = await ProjectMember.findOne({
            project: mongoose.Types.ObjectId(projectId),
            user: mongoose.Types.ObjectId(req.user._id),
            
        })

        if(!project){
            throw new ApiError(401, "Projeect not found ")
        }

        const givenRole = project?.role

        req.user.role = givenRole

        if(!roles.includes(givenRole)){
            throw new ApiError(403, "YOu do nor have permission to perfom this action. ")
        }

    })