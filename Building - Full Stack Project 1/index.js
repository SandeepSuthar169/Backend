import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors({
    origin:""
}))


const port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/sandeep", (req, res) => {
    res.send("hellow sandeep!")
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
