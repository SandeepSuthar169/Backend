import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import db from './utils/db.js'
import userRoutes from "./routes/user.routes.js"

dotenv.config()


const app = express()
const port = process.env.PORT || 400

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-type', 'Authorization'] 
}))



app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.use("/api/v1/users", userRoutes)

db()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
