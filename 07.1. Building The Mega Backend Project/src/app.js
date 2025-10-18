import express from "express"

const app = express()


// router impots

import healthCheckRouter from "./routes/helthcheck.routes.js"

app.use("/api/v1/helthcheck", healthCheckRouter)

export default app;
