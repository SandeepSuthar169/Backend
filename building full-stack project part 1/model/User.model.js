import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    paassword: String,
    role:{
        type: String,
        enum:['user', 'admin'],
        default: "user"
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    varificationToken:{
        type: String
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExprires:{
        type: Date,
    }
}, 
{
    timestamps:true
})


const User =  mongoose.model("User", userSchema)

export default User 