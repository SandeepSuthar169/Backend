import User from "../model/User.model.js";
import crypto from "crypto"
import nodemailer from "nodemailer"
// import JsonWebTokenError  from "jsonwebtoken";

const registerUser = async (req, res) => {
    // get data
    // validate
    // check if user already exists
    // crate a user in database
    // crete a varifiacation token
    // save token in dataBase
    // send taken as emil to user
    // send success status to user

    const {name, email, password} = req.body
    if (!name || !email || !password){
        return res.status(400).json({
            message: "All fields are required"
        });
    };

    try {
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const user = await User.create({
            name, 
            email,
            password
        })
        console.log(user);
        

        if(!User){
            return res.status(400).json({
                message: "User not registerd"
            })
        }

        const token = crypto.randomBytes(32).toString("hex")
        console.log(token);
        user.varificationToken = token

        await user.save()

        // send email
        const transporter = nodemailer.createTransport({
            host: "process.env.MAILTRAP_HOST",
            port: "process.env.MAILTRAP_PORT",
            secure: false, // true for 465, false for other ports
            auth: {
                user: "process.env.MAILTRAP_USERNAME",
                pass: "process.env.MAILTRAP_PASSWORD",
            },
        });
        
        const mailOption = {
                from: '"process.env.MAILTRAP_SENDEREMAIL',
                to: "user.email",
                subject: "verify your email",
                text: `Plase click on the following link: 
                ${process.env.BASE_URL}/api/v1/users/verify/${token}
                `,
        }

        await transporter.sendMail(mailOption)

        res.status(201).json({
            message: "User register successfully",
            success: true
        }) 
        
    } catch (error) {
        res.status(400).json({
            message: "User not registered ",
            error,
            success: false
        }) 
    }
    
};
    
const verifyUser = async (req, res) => {
    //get token from url 
    // validate
    // find uesr based on token
    // if not
    // set isvarified fiead true
    //remove rerifivatoin token 
    // save
    // return response

    const { token } = req.params
    console.log(token);
    if (!token ){
        return res.status(400).json({
            message:" Invalid token"
        })
    }
    const user = await User.findOne({varificationToken: token})
    
    if (!user ){
        return res.status(400).json({
            message:" Invalid User"
        })
    }
    user.isVerified  = true
    user.varificationToken = undefined // undefined ? null ? , string value ? other .....
    await user.save()
};

const login = async (req, res) => {
    const {email, paassword} = req.body

    if(!email || !paassword){
        return res.status(400).json({
            message: "All fields are required"
        });
    };

    try {
        const user = await User.findOne({email})     // email:email 
        if (!user ){
            return res.status(400).json({
                message:" Invalid email or password"
            });
        };   

        const isMatch = await bcrypt.compare(paassword, user.paassword)
        
        console.log(isMatch);
        
        if (!isMatch ){
            return res.status(400).json({
                message:" Invalid email or password"
            })
        }   


        //user.isvarifid status code(200)
        
        jwt.sign(
            {id: user._id, role: user.role},

            "shhhhh", 
            {
                expiresIn: "24h"
            }
        );
        const cookieOption = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        }
        res.cookie("token", token, {cookieOption})

        res.status(200).json({
            success:true,
            message: "Login seccessful",
            token,
            user: {
                id: user_id,
                mane: user.name,
                role: user.role,
            },
        });
    } catch (error) {}


};


export { registerUser, verifyUser, login }