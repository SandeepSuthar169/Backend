import express from "express"
import axios from "axios"
import Redis from "ioredis"

const app = express()
const PORT = process.env.PORT ?? 8000



const redis = new Redis({
    host: "localhost",
    port: Number(6379)
})


app.get("/", (req, res) => {
    return res.json({stauts : "success"});
})

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



app.listen(PORT, () => console.log(`server is runing at PORT $${PORT}`))