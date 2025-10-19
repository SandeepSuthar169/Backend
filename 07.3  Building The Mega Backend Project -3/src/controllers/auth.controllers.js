import  { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/async-handler.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { sendMail, emailVerificationMailGenContent, forgotPasswordMailGenContent } from "../utils/mail.js";



const registerUser = asyncHandler(async (req, res) => {
    const {email, username, password} = req.body
    //1. check email, username, passwaord not exist
    if(!email || !username || !password){
      throw new ApiError(400, "User not have regist info.")
    }

    //2. email, password validation or check
    if(password.length < 10){
        throw new ApiError(400, "Password must be less than 10 char")
    }
    try {
        //3. user already exist or not 
        const existingUser = await User.findOne({email})
        if(existingUser){
            throw new ApiError(400, "User already exists");
        }

        //4. user a new create
        const user = User.create({
            email,
            password,
            username,
            isEmailVerified: false

        })

        if(!user){
            throw new ApiError(400, "User does not exist ")
        }



        const { unHashedToken, hashedToken, tokenExpiry } = User.generateTemporyToken()
        user.emailVerificationToken = hashedToken
        user.emailVerificationToken = tokenExpiry

        await user.save()

        
        sendMail({
            email: user.email,
            subjectL: "Verify your email",
            mailGenContent: emailVerificationMailGenContent(
                 user.username,
                `${process.env.BASE_URL}/api/v1/users/verifyEmail/${unHashedToken}`
        
            )
        })

        return res.status(200).json(
            new ApiResponse(200, 
                { 
                    userId: user._id, 
                    email: user.email 
                }, 
                "User registered successfully")
        );
        

    } catch (error) {
        
    }
   
    //5. check user not exist 
    //6. 

    
});


const loginUser = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

    
});


const logoutUser = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

    
});

const verifyEmail = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

    
});



const resendVerificationiEmail = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

    
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

});


const getCurrentUser = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

});


export { registerUser }