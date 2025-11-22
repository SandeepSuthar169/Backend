import express from "express"
import axios from "axios"

const app = express()
const PORT = process.env.PORT ?? 8000

app.get("/", (req, res) => {
    return res.json({stauts : "success"});
})

app.get('/books', async (req, res) => {
    const response = await axios.get('https://api.freeapi.app/api/v1/public/books')

    const books = response?.data?.data?.data 

    const total = books.reduce((acc, curr) => {
        const pages = curr.volumeInfo?.pageCount ?? 0;
        return acc + pages;
    }, 0);

    console.log(total);

    return res.json({ totalPages: total, books });
});



app.listen(PORT, () => console.log(`server is runing at PORT $${PORT}`))