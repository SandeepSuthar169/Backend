import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/user.models.js"
import { ApiError} from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { ProjectMember } from "../models/projectmember.models.js";



export const verifyJWT = asyncHandler(async (req, res, next) => {   // req, res, === req, _, 

  //   console.log("=== JWT VERIFICATION DEBUG ===");
  //   console.log("Cookies:", req.cookies);
  //   console.log("Authorization Header:", req.header("Authorization"));
  //   console.log("Token extracted:", req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", ""));
  //  console.log("==============================");

    
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

      if(!token){
        throw new ApiError(401, "Unauthorized request")
      }
    
      const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
      if(!decodedToken){
        throw new ApiError(401, "Invalid Access token")
      }
    
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
      if(!user){
        throw new ApiError(401, "Invalid Access token")
      }
    
      req.user = user;
      next()

// } catch (error) {
//     throw new ApiError(401, "Invalid access token")
// }
})

export const validateProjectPermission = (roles = []) => 
    asyncHandler(async (req, res, next) => {
        const { projectId } = req.params

        if(!projectId){
            throw new ApiError(401,  "invalid project Id ")
        }

        const project = await ProjectMember.findOne({
            project: new  mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(req.user._id),
            
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