import  { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/async-handler.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { sendMail, emailVerificationMailGenContent, forgotPasswordMailGenContent } from "../utils/mail.js";
import crypto from "crypto"


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

    //3. user already exist or not 
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new ApiError(400, "User already exists");
    }

    //4. user a new create
    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false

    })

    if(!user){
        throw new ApiError(400, "User does not exist ")
    }



    const { unHashedToken, tokenExpiry , hashedToken} = User.generateTemporyToken()
    user.emailVerificationToken = hashedToken
    user.emailVerificationExpiry = tokenExpiry

    await user.save({ velidateBeforeSave: false})     /*   { validateBeforeSave: false }
                            This is an option passed to the save() method. 
                            Normally, when you save a Mongoose model, 
                            it runs validation checks on the data before saving. 
                            Setting validateBeforeSave: false skips those validation checks.
                            */


    try {
        sendMail({
            email: user.email,
            subject: "Verify your email",
            mailGenContent: emailVerificationMailGenContent(
                 user.username,
                `${process.env.BASE_URL}/api/v1/users/verifyEmail/${unHashedToken}`
        
            )
        })


    } catch (error) {
        user.emailVerificationToken = undefined
        user.emailVerificationExpiry = undefined
        await user.save({ velidateBeforeSave: false })

        throw new ApiError(500, "Failed to send verification email. Please try again later.");

    }   


    return res.status(201).json(
        new ApiResponse(201, 
            { 
                userId: user._id, 
                email: user.email 
            }, 
            "User registered successfully")
    );


    
});

const verifyEmail = asyncHandler(async (req, res) => {
   try {
    const verification = req.params

    console.log(verification);

    if(!verification){
        throw new ApiError(400, "verification token is required")
    }
    
    const hashedToken = c

   } catch (error) {
    
   }
    

    
});

const loginUser = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

    
});


const logoutUser = asyncHandler(async (req, res) => {
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