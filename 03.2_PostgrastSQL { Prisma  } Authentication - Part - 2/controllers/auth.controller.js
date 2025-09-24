import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"


const prisma  = new PrismaClient();
//-----------------------------------------------------------------------
export const registerUser = async (req, res) => {

   const { name, email, password, phone } = req.body
    if(!name || !email || !password || !phone ){
        console.log("Data is missing");
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }
//-----------------------------------------------------------------------
    try {
        const  existingUser = await prisma.user.findUnique({
            where: {email}
        })
//-----------------------------------------------------------------------
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
//-----------------------------------------------------------------------
        // hash the pass
        const hashPassword = await bcrypt.hash(password, 10)
        const verificationToken =  crypto.randomBytes(32).toString("hex")
        console.log(verificationToken);
        

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashPassword,
                verificationToken
            }
        })
        console.log(user);

        if(!user){
            return res.status(400).json({
                message: "user not registered"
            })
        }
        
//----------------------------------------------------------------------- 
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, 
            auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOption = {
            from: process.env.MAILTRAP_SENDEREMAIL,
            to: user.email,
            subject: "register you email", // plain‑text body
            text: `Please click on the following link: ${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}`,
        }

        await transporter.sendMail(mailOption)

        res.status(200).json({
            message: "user registerd successfully",
            success: true
        });


    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: "Registration failed",
        });
    }
   

};

//-----------------------------------------------------------------------
export const loginUser = async (req, res) => {
    const { email, password } = req.body

    if(!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        });
    }
//-----------------------------------------------------------------------

    try {
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if(!user){
            return res.status(400).json({
                message: "User not existes ",
                success: false
            })
        }
//-----------------------------------------------------------------------
        const isMatch = bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                message: "Password are not same, [isMatch]",
                success: false
            });
        }
//-----------------------------------------------------------------------
        const token =  jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )
        const cookieOptions = {
            httpOnly: true
        }

        res.cookie('token', token, cookieOptions)

        return res.status(201).json({
            success: true,
            message: "",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        })















//-----------------------------------------------------------------------
    } catch (error) {
        return res.status(400).json({
            message: "Login failed",
            success: false,
        });
    }
}