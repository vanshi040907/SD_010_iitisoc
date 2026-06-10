const express = require('express');
const app = express();
const http = require("http");
const {Server} = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const PORT = 5000;
const {connectmongoose}= require("./connection");
const cookieparser = require("cookie-parser");
const userrouter = require("./routes/user");
const roomrouter = require("./routes/room");
connectmongoose("mongodb://127.0.0.1:27017/whiteboard");
app.use((req,res,next) => {
    req.io = io;
    next();
})
app.use(cookieparser);

app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});
app.get('/user',userrouter );
io.on('connection',(socket) => {
    console.log("new user");
})
app.get('/room',roomrouter );



app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});