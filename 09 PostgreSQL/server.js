import express from 'express';

const app = express();

app.get('/', (req, res)=> {
    res.json({
        message: "welcome"
    })
})

app.listen(3001, () => 
    console.log("app listening on port 3001"))