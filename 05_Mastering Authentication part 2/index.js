import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"




const app = express()
dotenv.config()

const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cors({
    origin:  process.env.BASE_URL, 
    Credentials: true
}))
app.use("/auth", authRoutes)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

db()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
