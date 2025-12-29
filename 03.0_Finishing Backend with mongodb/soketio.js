import express from "express"
import axios from "axios"
import db from "./utils/db.js";
import Redis from "ioredis";
import http from "http"
import { Server } from 'socket.io';



const app = express()  // Expres server
const httpServer = http.createServer(app) // HTTP server (mount of Express server on HTTP)
const io = new Server(httpServer); // socket

io.on("connection", (socket) => {
    // socket.disconnect()
    console.log(`Socket Connected`, socket.id );
})


//-------------------
const PORT = process.env.PORT ?? 8002;

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

app.use(express.static("./public"))

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

httpServer.listen(PORT, () => console.log("HTTP  is running ON ", PORT))