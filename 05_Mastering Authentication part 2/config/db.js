import mongoose from "mongoose";

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected");
        
    } catch (error) {
        console.log("MongoDB Connection error ", error);
    }
}

export default db