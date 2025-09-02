import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";
import cookieParser from "cookie-parser";

// import all routes
import userRouters from "./routes/user.routes.js"


dotenv.config();



const app = express();

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
    })
);
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


const port = process.env.PORT || 4000


app.get('/', (req, res) => {
    res.send('Hello everyOn')
})

app.get('/Sandeep', (req, res) => {
    res.send('moye moyee')
})

// console.log(process.env.PORT);
//connenct to db
db();

//user routes
app.use("/api/v1/users/", userRouters)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
