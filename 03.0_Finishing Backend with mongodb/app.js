import express from "express"
import axios from "axios"
import db from "./utils/db.js";
import Redis from "ioredis";

const app = express()
const PORT = process.env.PORT ?? 8001;

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

app.get("/", (req, res) => {
    return res.json({
        status: "success"
    })
})

app.get("/books", async (req, res) => {


    const response = await axios.get("https://api.freeapi.app/api/v1/public/books")
    return res.json(response.data)
})


app.get("/books/total", async (req, res) => {
        const cacheValue = await redis.get("totalPageValue")
        if (cacheValue) {
            return res.json({
                totalPageCount: Number(cacheValue)
            })
        }

        const response = await axios.get(
            "https://api.freeapi.app/api/v1/public/books"
        )

        const books = response.data.data.data

        const totalPageCount = books.reduce(
            (acc, curr) => acc + (curr.volumeInfo.pageCount),
            0
        )

        await redis.set("totalPageValue", totalPageCount)

        return res.json({ totalPageCount })

        
})


db()

app.listen(PORT, () => console.log("server is running", PORT))