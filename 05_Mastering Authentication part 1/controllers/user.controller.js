import User from "../models/user.model.js"
import sendVerificationEmail from "../utils/sendMail.utils.js "
import crypto from "crypto"

const register = async (req, res) => {

    //1. get user data from req body-------------------------------
    const { name, email, password } = req.body

    //2. validate data-------------------------------
    if(!name || !email || !password){
        return res.status(400).json({
            message: "user is not  exites"
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
        const existingUser = User.findOne({email})

        if(existingUser) {
            return  res.status(400).json({
                message: "User is aldary exists"
            })
        }

        //2. user temporary verificatoin token-------------------------------
        const token = crypto.randomBytes(32).toString('hex')
        const verificationTokenExpriry = Date.now() + 10 * 60 * 60 * 1000 

        //3. create a new user -------------------------------
        const user = await User.create({
            name,
            email,
            password,
            verificationToken: token,
            verificationTokenExprixy: verificationTokenExpriry
        })
        if(!user){
            return  res.status(400).json({
                message: "user not exists"
            })
        }

        // 4 mail send 
        await sendVerificationEmail(user.email, user.verificationToken)
        
        // response to user

        return res.status(200).json({
            message: "user register successfuly",
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
            message: "Intervel server error"
        }) 
    }
}

const verify =  async (req, res) => {
    try {
        //1. get token from params
        const token = req.params.token
        
        //get user
        const user = User.findOne({
            verificationToken: token,
            verificationTokenExprixy: {$gt: Date.now()}
        })

        //
    } catch (error) {
        
    }
} 
export {register}