import crypto from "crypto"
import jwt from "jsonwebtoken"
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

    await user.save({ velidateBeforeSave: false})     
    /*   
             { validateBeforeSave: false }
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
    
    const hashedToken = crypto.createHash("sha256").update(verification).digest("hex")

    const user = User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: { $gt: Date.now()}
    })

    console.log(user);

    if(!user){
        throw new ApiError(400, "Invalid hahed token! ")
    }

    user.isEmailVerified =  true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save({velidateBeforeSave: false})

    return res.status(200).json(
        new ApiResponse(
          200,
          { email: user.email },
          "Email verified successfully."
        
    ))
    
   } catch (error) {
        throw new ApiError(500, "failed to user verification", error);
   }
    

    
});

const loginUser = asyncHandler(async (req, res) => {
    const {email,  password } = req.body

    if(!email || !password){
        throw new ApiError(400, "user not verify & all fields are required ")

    }try {
        const user = await User.findOne({email})

        if(!user){
            throw new ApiError(400, "user not fiends ")
        }

        if(!user.isEmailVerified){
            throw new ApiError(400, "verify your email before Login process. ")
        }
        const PasswordValid = await user.isPasswordCorrect(password)

        if(!PasswordValid){
            throw new ApiError(400, "Password is not valid")
        }



        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()  

        user.refreshToken = refreshToken;


        await user.save({ velidateBeforeSave: false})

        const cookiOption = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000  // One day
        }

        res.cookie("accessToken", accessToken, cookiOption)
        res.cookie("refreshToken", refreshToken, cookiOption)


        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    },
                    accessToken,
                    refreshToken
                },
                "user login successfuly."
            )
        )
        

        

    } catch (error) {
        throw new ApiError(500, "failed to user login.  ", error);
    }

    
});


const logoutUser = asyncHandler(async (req, res) => {
    const refreshToken = req.cookie.refreshToken || req.body.refreshToken

    if(!refreshToken){
        throw new ApiError(400, "Unauthorized access")
    }

    const user = user.findOne({ refreshToken })
    
    if(!user){
        throw new ApiError(400, "Unauthorized user access")
    }
    
    user.refreshToken=null;

     await user.save({ velidateBeforeSave: false })
     
     res.clearCookie({
        httpOnly: true,
        secure: true,
     })

    return res.status(200).json(
        new ApiResponse(200, "User logout successfuly")
    )
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
    const { currentPassword, updatePassword } = req.body
    
    if(!currentPassword || !updatePassword ){
        throw new ApiError(400, "Both currentPassword and updatePassword is required!")
    }

    const user = User.findById(req.user?._id)

    if(!user){
        throw new ApiError(400, "user is required!")
    }

    if(updatePassword < 10){
        throw new ApiError(400, "updatePassword length less than 10 char. ")
    }
    user.password = updatePassword  

    await user.save({ velidateBeforeSave: false })

    return req.status(200).json(
        new ApiResponse(
            200,
            {},/* No additional data to return: 
            The password change was successful, but there's no specific data (like a user object or token)
             to send back. So, an empty object is used to indicate "no data" while still maintaining
              a consistent response structure.*/
            "password update successfuly."
        )
    )

});


const getCurrentUser = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

});
481

export { registerUser, verifyEmail, loginUser, logoutUser }