import mongoose from "mongoose";


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected");
        
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1)    // Stop Node.js app now because error in codebase. 
                          //process.exit(0)  Exit code means success (no errors).
    } 
}

export default connectDB;
