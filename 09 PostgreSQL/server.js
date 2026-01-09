import express from 'express';
import { prisma } from './src/config/db.js';

const app = express();

app.get('/', (req, res)=> {
    res.json({
        message: "welcome"
    })
})


app.post("/api/users", async (req, res) => {
    const {email, name} = req.body

    const user = await prisma.user.create({
        data: {
            email,
            name
        }
    })

    return res.json(user)
})

app.listen(3001, () => 
    console.log("app listening on port 3001"))