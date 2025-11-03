
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
app.use(cors({
    origin: process.env.BASE_URL,
    Credential: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"))
app.use(express.urlencoded(
    {
        extended: true
    }
))


// router impots

import authRoute from "./routes/auth.routes.js"
import healthCheckRouter from "./routes/helthcheck.routes.js"

app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", authRoute)
export default app;
