import express from "express"

const app = express()


// router impots

import healthCheckRouter from "./routes/helthcheck.routes.js"

app.use("/api/v1/healthcheck", healthCheckRouter)

export default app;
