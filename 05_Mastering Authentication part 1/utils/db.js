import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const db = () => {
    mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("db connection succesful");
    })
    .catch(() => {
        console.log("db not connect", );
        
    })
}

export default db