import express from "express"
import dotent from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
// constom route
import userRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"


dotent.config()
const port = process.env.PORT || 4000
const app = express()


app.use(cookieParser())
app.use(cors({
    origin: process.env.BASE_URL,
    credentials:true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders:['Authorization', 'Content-Type']
}))
app.use(express .json())
app.use(express.urlencoded({extended:true}))
app.use(express.cookieParser())

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "test checked"
    })
})


app.use('/api/v1/users', userRouter)


app.listen(process.env.PORT, () => {
    console.log(`Backend is listeninig at port: ${port} `);
    
})