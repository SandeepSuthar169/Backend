import express from "express"

const app = express()
const port = process.env.port || 8008;

app.get("/", (req, res) => {
    res.send("hiiiiiiii i am use Docker in nodejs backend! ")
})

app.listen(port, () => {
    console.log("app listen on port", port);
})