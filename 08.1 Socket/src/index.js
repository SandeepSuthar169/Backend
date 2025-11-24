import express from "express"
import axios from "axios"
import Redis from "ioredis"
import http from "http"
import { Server } from "socket.io";
import { Socket } from "dgram";


const app = express()

const httpServer = http.createServer(app)   // HTTP Server (Express Server ki mount Kardiya http pe)

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})  // Scoket server
// io.attach(httpServer);


io.on('connection',(socket) => {
    console.log("Socket Connected", socket.id );
    setInterval(() => {
        Socket.emit("hello")   
    }, 2000)
})







const PORT = process.env.PORT ?? 8000



const redis = new Redis({
    host: "localhost",
    port: Number(6379)
})


app.get("/", (req, res) => {
    return res.json({stauts : "success"});
})

app.use(express.static('./public'))


// middleware 
app.use(async function (req, res, next){
    const key = `rat-limit`;                // const key = `rat-limit${UserId}`;
    const value = await redis.get(key)

    if(value === null){
        await redis.set(key, 0)
        await redis.expire(key, 60)   // 60 sec
    }

    if(value > 10 ){
        return res.status(429).json({
            message: "Tpp many requests"
        }) 
    } 

    redis.incr(key);
    next()
})

app.get('/books/total', async (req, res) => {
    const cachedValue = await redis.get('totalPagesCount')
    if(cachedValue){
        console.log(`Cache Hit`);
        
        return res.json({ totalPages: Number(cachedValue) });
    
    }

    const response = await axios.get('https://api.freeapi.app/api/v1/public/books')

    const totalPagesCount = response?.data?.data?.data?.reduce(
        (acc, curr) => { const pages = curr.volumeInfo?.pageCount ?? 0;
    
            return acc + pages;
        }, 0);

        console.log(`Cache Miss`);

        await redis.set("totalPagesCount", totalPagesCount)


    return res.json({ totalPages:totalPagesCount });
});



httpServer.listen(PORT, () => console.log(`HTTP Server is runing on PORT ${PORT}`))