const express = require('express');
const app = express();
const PORT = 5000;
const {connectmongoose}= require("./connection");
const cookieparser = require("cookie-parser");
const userrouter = require("./routes/user");
connectmongoose("mongodb://127.0.0.1:27017/whiteboard");

app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});
app.get('/user',userrouter );

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});