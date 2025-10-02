import User from "../models/user.model.js"
import sendVerificationEmail from "../utils/sendMail.utils.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"



const register = async (req, res) => {

    //1. get user data from req body-------------------------------
    const { name, email, password } = req.body

    //2. validate data-------------------------------
    if(!name || !email || !password){
        return res.status(400).json({
            message: "User does not exist"
        })
    }
    //3. password check-------------------------------
    if(password.length < 6){
        return  res.status(400).json({
            message: "Password minimum length 6 char"
        })
    }

    try {
        // 1. User already or not  -------------------------------
        const existingUser = await User.findOne({email})

        if(existingUser) {
            return  res.status(400).json({
                message: "User already exists"
            })
        }

        //2. user temporary verificatoin token-------------------------------
        const token = crypto.randomBytes(32).toString('hex')
        console.log(token);
        
        const verificationTokenExpriry = Date.now() + 10 * 60 * 60 * 1000 

        //3. create a new user -------------------------------
        const user = await User.create({
            name,
            email,
            password,
            verificationToken: token,
            verificationTokenExprixy: verificationTokenExpriry
        })
        console.log(user);
        
        if(!user){
            return  res.status(400).json({
                message: "user not exists"
            })
        }

        // 4 mail send 
        await sendVerificationEmail(user.email, user.verificationToken)
        
        // response to user

        return res.status(200).json({
            message: "user register successfully",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,

            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        }) 
    }
}

const verify =  async (req, res) => {
    try {
        //1. get token from params
        const token = req.params.token

        console.log(token);
        
        if(!token){
            return res.status(400).json({
                message: "token is invalid"
            })
        }
        //get user
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExprixy: { $gt: Date.now() }
        })
        console.log(user);
        console.log("user is here ");
        

        //is user exists
        if(!user){
            return res.status(400).json({
                message: "Invalid or expired varification token"
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined
        user.verificationTokenExprixy = undefined

        await  user.save()

        return res.status(200).json({
            message: "User account has been verified"
        })

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
} 

const login = async (req, res) => {
    //1. get user data
    const { email, password } = req.body;

    //2. verify user
    if(!email ||!password) {
        return res.status(400).json({
            message: "user not verify & all fields are required" 
        })
    }
    console.log("it is email or password");
    
    try {
        //find user by email
        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({
                message: "user not found user though login"
            })
        }
        console.log("user oks");
        

        // check if user verify
        if(!user.isVerified){
            return res.status(400).json({
                message: "user not verify"
            })
        }
        console.log("user oksaa");

        const isPasswordMatch  = await user.comparePassword(password)
        console.log(isPasswordMatch);
        
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const JwtToken = jwt.sign(
            {   id: user._id    },
            process.env.JWT_SECRET,
            {   expiresIn: "1h"    }
        );

        const cookieOptons = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
        }

        res.cookie("JwtToken", JwtToken, cookieOptons)

        return res.status(200).json({
            message: "login successfuly",
            success: true
        })




    } catch (error) {
        return res.status(500).json({
            message: "Intervel server error in login "
        }) 
    }
    }


export {register, verify, login}