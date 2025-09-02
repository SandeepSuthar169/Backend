import mongoose from "mongoose";
import bcrypt from "bcryptjs";



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

//huck 
userSchema.pre("save", async function (next) {
    if(this.isModified("paassword")){
        this.paassword = bcrypt.hash(this.paassword, 10)
    }
    next()
})

const User =  mongoose.model("User", userSchema)

export default User 