require('dotenv').config();
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
const User = require("./models/user");
const Room = require("./models/room");
const { ValidateToken } = require("./service/auth");
const cookie = require("cookie");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = 5001;
const { connectmongoose } = require("./connection");
const cookieparser = require("cookie-parser");
const userrouter = require("./routes/user");
const roomrouter = require("./routes/room");
const whiteboardrouter = require("./routes/whiteboard");
const { restrictToLoggedinUser,requiredEditorAccess} = require("./middleware/auth");

connectmongoose("mongodb://127.0.0.1:27017/whiteboard");

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(cookieparser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});

app.use('/user', userrouter);


io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || " ");
    const useruid = cookies.uid;
    if (!useruid) return next(new Error("login required"));
    const user = ValidateToken(useruid);
    if (!user) return next(new Error("login required"));
    socket.user = user;
    next();

})


io.on('connection', (socket) => {
    

    socket.on('joinroom', async(data) => {
        const { roomID, myName } = data;
        socket.join(roomID);
        socket.join(socket.user.id);
          const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
            const room= await user.ActiveRoom.populate("participants.user");
    const m = room.participants.find((x) => x.user._id.toString()===userid.toString());
     

        socket.broadcast.to(roomID).emit("new user",{name: myName,role:m.role});
    });
    socket.on('refresh', async() => {
         
        
         const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
        const room = user.ActiveRoom;
        socket.join(room.roomId);
        socket.join(socket.user.id);
    
    });
    socket.on("pending",(data) => {
        console.log("hhhhhhh");
          socket.join(socket.user.id);
        
    });
    socket.on("cancelPending",(data) => {
         socket.leave(socket.user.id);

    });

    socket.on("emojisend", async (data) => {
        const { emoji } = data;
        const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
        const room = user.ActiveRoom;
        io.to(room.roomId).emit("emojireceived", { emoji: emoji, user: user });
    });
    socket.on("introrole",async() => {
        
        const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
          const room= await user.ActiveRoom.populate("participants.user");
    const m = room.participants.find((x) => x.user._id.toString()===userid.toString());
     
    
        
    

     socket.emit("role",{role:m.role});
    })

    socket.on("historysend", async (data) => {
        const { history } = data;
        const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
          const room= await user.ActiveRoom.populate("participants.user");
    const participants = room.participants;
    const m = participants.some((x) => x.user._id.toString()===userid.toString()&&(x.role==="Editor"||x.role==="Host"));
        if(!m) {
          socket.emit("access",{response:"Required Editor Access"});
          return;
        }
        if (room.roomId === null) return;
        socket.to(room.roomId).emit("historyreceived", { history: history });
    });

    socket.on("currentsend", async (data) => {
        const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
          const room= await user.ActiveRoom.populate("participants.user");
    /*const participants = room.participants;
    const m = participants.some((x) => x.user._id.toString()===userid.toString()&&(x.role==="Editor"||x.role==="Host"));
        if(!m) {
          socket.emit("access",{response:"Required Editor Access"});
          return;
        }*/
        socket.to(room.roomId).emit("currentreceived", data);
    });

    socket.on("currentshapesend", async (data) => {
        const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
          const room= await user.ActiveRoom.populate("participants.user");
    const participants = room.participants;
    const m = participants.some((x) => x.user._id.toString()===userid.toString()&&(x.role==="Editor"||x.role==="Host"));
        if(!m) {
          socket.emit("access",{response:"Required Editor Access"});
          return;
        }

        io.to(room.roomId).emit("currentshapereceived", data);
    });

    socket.on("text", async (data) => {
        const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
    
          const room= await user.ActiveRoom.populate("participants.user");
    const participants = room.participants;
    const m = participants.some((x) => x.user._id.toString()===userid.toString()&&(x.role==="Editor"||x.role==="Host"));
        if(!m) {
          socket.emit("access",{response:"Required Editor Access"});
          return;
        }
        socket.to(room.roomId).emit("showtext", data);
    });

    socket.on("logout", async (data) => {
        const userid = socket.user.id;
        const user = await User.findById(userid);
        const roomid = user.ActiveRoom;
        const room = await Room.findById(roomid);
        const rid = room.roomId;
        const username = user.userName;
        socket.to(rid).emit("leave me!", { username });
    });

    socket.on("objectmoving", async (data) => {
        const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
    
        const room= await user.ActiveRoom.populate("participants.user");
    const participants = room.participants;
    const m = participants.some((x) => x.user._id.toString()===userid.toString()&&(x.role==="Editor"||x.role==="Host"));
        if(!m) {
          socket.emit("access",{response:"Required Editor Access"});
          return;
        }

        socket.to(room.roomId).emit("showobjectmoving", data);
    });

});

app.use('/room', restrictToLoggedinUser, roomrouter);
app.use('/whiteboard', restrictToLoggedinUser, whiteboardrouter);

server.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});