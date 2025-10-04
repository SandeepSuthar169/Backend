import express from "express"
import dotenv from "dotenv"

dotenv.config()


const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cors({
    origin:  process.env.BASE_URL, 
    Credentials: true
}))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
