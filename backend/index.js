const express = require('express');
const app = express();
const http = require("http");
const {Server} = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
const User = require("./models/user"); 
const Room = require("./models/room"); 
const { ValidateToken } = require("./service/auth");
const cookie = require("cookie");
const io = new Server(server,{
     cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
        credentials: true
    } }    
);
const PORT = 5000;
const {connectmongoose}= require("./connection");
const cookieparser = require("cookie-parser");
const userrouter = require("./routes/user");
const roomrouter = require("./routes/room");
const whiteboardrouter = require("./routes/whiteboard");
const {restrictToLoggedinUser} = require("./middleware/auth")
connectmongoose("mongodb://127.0.0.1:27017/whiteboard");
app.use((req,res,next) => {
    req.io = io;
    next();
})
app.use(cookieparser());
app.use(cors(
    {
    origin: "http://localhost:5173",  
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});
app.use('/user',userrouter );
io.use((socket,next) => {
    const cookies = cookie.parseCookie(socket.handshake.headers.cookie || " ");
    const useruid = cookies.uid;
    if(!useruid) return next(new Error("login required")); 
    const user = ValidateToken(useruid);
    if(!user) return next(new Error("login required")); 
    socket.user=user;
    next();
    
})
io.on('connection',(socket) => {
    socket.on('joinroom',(data) => {
    const {roomID, myName} = data;
    socket.join(roomID);
    console.log(roomID)
         console.log(`${myName} joined ${roomID} ${socket.id}`);

    
    socket.broadcast.to(roomID).emit("new user",myName ); 
    
})
socket.on("emojisend",async(data) => {
    const {emoji} = data;
    const userid = socket.user.id;
    const user = await User.findById(userid);
    const roomid= user.ActiveRoom;
     const room = await Room.findById(roomid);
    
    console.log(room.roomId);
    
    io.to(room.roomId).emit("emojireceived", {emoji:emoji, user:user});
    
})

})
app.use('/room',restrictToLoggedinUser,roomrouter );
app.use('/whiteboard',restrictToLoggedinUser,whiteboardrouter );



server.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});