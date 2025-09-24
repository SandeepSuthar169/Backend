import express from "express"
import dotent from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
// constom route
import userRouter from "./routes/auth.route.js"


dotent.config()
const port = process.env.PORT || 4000
const app = express()


app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
}))
app.use(express .json())
app.use(express.urlencoded({extended:true}))

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