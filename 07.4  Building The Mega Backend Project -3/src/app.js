import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: "include",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
import projectRoute from "./routes/project.routes.js"
import noteRoute from "./routes/note.routes.js"

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/project", projectRoute)
app.use("/api/v1/note", noteRoute)


export default app;
