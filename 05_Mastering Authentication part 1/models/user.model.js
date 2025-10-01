import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        require: true
    },
    passwore: {
        type: String,
        require: true,
        minlength: 6
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    verificationToken: String,
    verificationTokenExprixy: Date,





},  {
    timestamps: true
    }
);

const User = mongoose.model('user', userSchema);

export default User;

