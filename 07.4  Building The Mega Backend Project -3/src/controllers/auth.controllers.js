import crypto from "crypto"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/async-handler.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { sendMail, emailVerificationMailGenContent, forgotPasswordMailGenContent } from "../utils/mail.js";
import { enableCompileCache } from "module"
import { toUSVString } from "util"


const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body
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



    const { unHashedToken, tokenExpiry , hashedToken} = user.generateTemporyToken()
    
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
                `${process.env.BASE_URL}/api/v1/auth/verifyEmail/${unHashedToken}`
        
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
                email: user.email,

            }, 
            "User registered successfully")
    );


    
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;

    // console.log(verificationToken);
    

    if (!verificationToken) {
        throw new ApiError(400, "Verification token is required");
    }

    const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: { $gt: Date.now() }
    });

    

    if (!user) {
        throw new ApiError(400, "Invalid or expired verification token!");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            { email: user.email },
            "Email verified successfully."
        )
    );
});


const loginUser = asyncHandler(async (req, res) => {
    const {email,  password } = req.body

    
    console.log("=== DEBUG JWT MIDDLEWARE ===");
    console.log("Cookies:", req.cookies);
    console.log("Auth Header:", req.header("Authorization"));
    console.log("All headers:", req.header);
    console.log("============================");
    

    if(!email || !password){
        throw new ApiError(400, "user not verify & all fields are required ")

    }
    
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
    
    
    try {
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()  

        

        user.refreshToken = refreshToken;


        await user.save({ velidateBeforeSave: false})

        const cookiOption = {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
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
        
    } 
    catch (error) {
        throw new ApiError(500, "failed to user login.  ", error);
    }

    
});

const logoutUser = asyncHandler(async (req, res) => {

    

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // Use ////$unset to remove the field
            }
        },
        {
            new: true
        }
    )

    const cookieoption = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", cookieoption)
        .clearCookie("refreshToken", cookieoption)
        .json(
        new ApiResponse(
            200,
            {},
            "User logout successfully!"
        )
    )


})


const resendVerificationiEmail = asyncHandler(async (req, res) => {
    //1.  get email from req.body
    const {email} = req.body

    console.log(req.body);
    

    if(!email){
        throw new ApiError(404, "emil not found ")
    }

    //2. user fing throw emil
    const user = await User.findOne({email})


    console.log("================user===================");
    // console.log(user);
    console.log("================user===================");
    

    if(!user){
        throw new ApiError(404, "use not found")
    }
    
    //3. user isEmailVerified or not

    if(user.isEmailVerified){
        throw new ApiError(400, "user email already verified!")
    }
    //4 generate verificaion token

    const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporyToken()
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    //5. user save
    await user.save({ velidateBeforeSave: false })
    //6. sending verification token from email

    try {
        sendMail({
            email: user.email,
            subject: "Again your email verify. ",
            mailGenContent: emailVerificationMailGenContent(
                user.username,
                `${process.env.BASE_URL}/api/v1/user/verifyEmail/${unHashedToken}`
            )
        })
    } catch (error) {
        user.emailVerificationToken = undefined
        user.emailVerificationExpiry = undefined
        await user.save({velidateBeforeSave: false})

        throw new ApiError(404, "faild to resend email verification!")
    }

    // success response
    return res.status(200).json(
        new ApiResponse(201, {
            email: user.email
        },
        "User again verify successfully"    
    )
    )

    

    
});


const refreshAccessToken = asyncHandler(async (req, res) => {

    console.log(req.cookie);
    console.log(req.body);
    
    
    //1. get refreshToken from cookies and body
    const  incomingRefreshToken  = req.cookie?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(404, "refresh token not found!")
    }

    //2. verify refresh token form jwt
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    //3. find the user based in decoded id

    const user = User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(404, "user not found")
    }
    
    //4. genrrate new access token or refresh token
    const newAccessToken = user.generateAccessToken()
    const newRefreshToken = user.generateRefreshToken()
    
    //5. save user
    await user.save({velidateBeforeSave: false})

    //6. update cookies
    const cookiOption = {
        httpOnly: true,
        secure: true,
    }
    //7. save cookie in new accesstoken and refresh token

    res.cookie("accessToken", newAccessToken, cookiOption)
    res.cookie("refreshToken", newRefreshToken, cookiOption)


    
    //8. success response with new access, refresh token. 

    return res.status(200).json(
        new ApiResponse(200, 
            {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            },
            "New refresh Token save successfully"
        )
    )
});

// const forgotPasswordRequest = asyncHandler(async (req, res) => {
//     // const {email, username, password, role} = req.body
//     //1. get email from req.body
//     const { email } = req.body
    
//     if(!email){
//         throw new ApiError(404, "email not found")
//     }
//     //2. find user from email
//     const user = User.findOne({ email })

//     if(!user){
//         throw new ApiError(404, "user not found")
//     }

//     const { hashedToken, tokenExpiry, unHashedToken } = User.generateTemporyToken()
//     //3. forgotPasswordToken and forgotPasswordExpiry update from is generateTemporyToken

//     user.forgotPasswordToken = hashedToken
//     user.forgotPasswordExpiry = tokenExpiry
//     //4. user save
//     await user.save({ velidateBeforeSave: false})
//     //5. send email so that mailGenContent in  forgetPasswordGencontent
    
//     try {
//         sendMail({
//             email: user.email,
//             subject: "forgot password token and expiry",
//             mailGenContent: forgotPasswordMailGenContent(
//                 user.username,
//                 `${process.env.BASE_URL}/api/v1/user/verifyEmail/${unHashedToken}`
//             )
//         })
//     } catch (error) {
//         user.forgotPasswordToken = undefined
//         user.forgotPasswordExpiry = undefined
//         await user.save({velidateBeforeSave: false})

//         throw new ApiError(400, "forgot password not successfully")
//     }


//     return res.status(200).json(
//         new ApiResponse(200, 
//             {
//                 email: user.email
//             },
//             "Password reset"
//         )
//     )
    
    
//     //6. handle catch part


// });

// const changeCurrentPassword = asyncHandler(async (req, res) => {
//     const { currentPassword, updatePassword } = req.body
    
//     if(!currentPassword || !updatePassword ){
//         throw new ApiError(400, "Both currentPassword and updatePassword is required!")
//     }

//     const user = User.findById(req.user?._id)

//     if(!user){
//         throw new ApiError(400, "user is required!")
//     }

//     if(updatePassword < 10){
//         throw new ApiError(400, "updatePassword length less than 10 char. ")
//     }
//     user.password = updatePassword  

//     await user.save({ velidateBeforeSave: false })

//     return req.status(200).json(
//         new ApiResponse(
//             200,
//             {},/* No additional data to return: 
//             The password change was successful, but there's no specific data (like a user object or token)
//              to send back. So, an empty object is used to indicate "no data" while still maintaining
//               a consistent response structure.*/
//             "password update successfuly."
//         )
//     )

// });


// const getCurrentUser = asyncHandler(async (req, res) => {
//     if(!req.user || !req.user?._id){
//         throw new ApiError(404, "Unauthorized user not accessed")
//     }

//     const { user } = User.findById(req.user._id).select("-passwoed -refreshToken -forgotPasswordToken -forgotPasswordExpiry")

//     if(!user){
//         throw new ApiError(404, "user not found")
//     }

//     return res.status(200).json(200,
//         {
//             user: user._id,
//             email: user.email,
//             fullname: user.fullname,
//             password: user.password,
//             isEmailVerified: user.isEmailVerified
//         },
//         "user information get successfully"
//     )

// });


export { 
    registerUser, 
    verifyEmail,
    refreshAccessToken, 
    resendVerificationiEmail, 
    // forgotPasswordRequest,
    // changeCurrentPassword,  
    loginUser, 
    logoutUser,
    // getCurrentUser 
}