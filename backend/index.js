require('dotenv').config();
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
const User = require("./models/user");
const Room = require("./models/room");
const Chat = require("./models/chat");
const { ValidateToken } = require("./service/auth");
const cookie = require("cookie");
const chatRoutes = require("./routes/chat");



const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 5001;
const { connectmongoose } = require("./connection");
const cookieparser = require("cookie-parser");
const userrouter = require("./routes/user");
const roomrouter = require("./routes/room");
const whiteboardrouter = require("./routes/whiteboard");
const { restrictToLoggedinUser,requiredEditorAccess} = require("./middleware/auth");

// console.log("MONGO_URI is:", process.env.MONGO_URI);

connectmongoose(process.env.MONGO_URI);

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(cookieparser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});

app.use('/user', userrouter);

app.use('/api', chatRoutes);

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

    // sending the message
socket.on('sendMessage', async ({ roomId, userId, userName, content }) => {
  try{
    if (!content?.trim()) return;

  const room = await Room.findOne({roomId});
  if(!room){
    console.error("sendMessage: room not found for this roomId", roomId);
    return;
  }

  const chat = await Chat.create({
    room: room._id,
    user: userId,
    userName,
    content: content.trim(),
  });

  io.to(roomId).emit('newMessage', {
    _id: chat._id,
    user: chat.user,
    userName: chat.userName,
    content: chat.content,
    sentAt: chat.sentAt,
  });
  }
  catch(err){
    console.error('Error saving/broadcasting message:', err);
  }
});

// for broadcasting laser

    socket.on('laserMove', (data) => {
        const{ roomID, x, y} = data;
        if(roomID == null || x==null || y==null) return;

        socket.to(roomID).emit('laserMoveReceived', {
            userId: socket.user.id,
            x,
            y,
        });
    });

    // for ending laser trail

    socket.on('laserEnd', (data) => {
        const {roomID} = data;
        if(roomID == null) return;

        socket.to(roomID).emit('laserEndReceived', {
            userId: socket.user.id,
        });
    });



// join room broadcasting and updating the memberlist
    socket.on('joinroom', async(data) => {
        const { roomID, myName } = data;
        console.log("socket id",socket.user.id);
       
        
        socket.join(roomID);
        socket.join(socket.user.id);
          const userid = socket.user.id;
         
        const user = await User.findById(userid).populate("ActiveRoom");
        
        
            const room= await user.ActiveRoom.populate("participants.user");
            const roomid = room.roomId;
        
         

    const m = room.participants.find((x) => x.user._id.toString()===userid.toString());
     

        socket.broadcast.to(roomID).emit("new user",{name: myName,role:m.role , Memid:userid});
       
           
        
    });
     socket.on('ready for offers', async({remotestream}) => {
        console.log("remotestream",remotestream);
       const userid = socket.user.id;
       const user = await User.findById(userid);
       const roomId = user.ActiveRoom;
       if(!user.ActiveRoom) return;
       const room = await Room.findById(roomId);
       const roomid = room.roomId;
     const offerid = room.participants[room.participants.length -1].user.toString();
     
      const participants = room.participants;

         io.to(offerid).emit("create offer",{id:offerid,participants});
       
   
});

    socket.on("ice-candidate", ({ candidate, to ,from}) => {
        console.log("ice-candidate");
  io.to(to).emit("ice-candidate", { candidate, from });
});

    socket.on("accept this offer",async({offer ,memid,id,participants})=>{
         io.to(memid).emit("accept this offer",{offer,memid,id,participants})
    })
    socket.on("accept answer",async({answer,memid,id})=>{
        io.to(id).emit("accept answer",{answer,memid,id});
    })

    //mute me 
    socket.on("unmute",async({enabled})=>{
        console.log("unmute listened");
        const userid = socket.user.id;
        console.log("userID",userid);
         const user = await User.findById(userid);
         console.log("user",user);
        if(!user.ActiveRoom) return;
            const roomID= await user.ActiveRoom;
            const room = await Room.findOneAndUpdate(
        { _id: user.ActiveRoom, "participants.user": userid },
        { $set: { "participants.$.enabled": enabled } }, 
        { new: true }
    );
            const roomid = room.roomId;
            console.log("room",roomid);
            
           
        io.to(roomid).emit("unmute",{id:userid})
    });

    socket.on("mute",async({enabled})=>{
        console.log("mute listened");
        const userid = socket.user.id;
        console.log("userID",userid);
         const user = await User.findById(userid);
         console.log("user",user);
        if(!user.ActiveRoom) return;
            const roomID= await user.ActiveRoom;
           const room = await Room.findOneAndUpdate(
        { _id: user.ActiveRoom, "participants.user": userid },
        { $set: { "participants.$.enabled": enabled } },  
        { new: true }
    );
            const roomid = room.roomId;
            console.log("room",roomid);
           
           
           
        io.to(roomid).emit("mute",{id:userid})
    })
   



   

    
    

    socket.on('refresh', async() => {
         
        
         const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
        const room = user.ActiveRoom;
        if(!room) return;
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

        socket.to(room.roomId).emit("currentshapereceived", data);
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
        if(!rid) return;
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

    socket.on("hostFollow",async() => {
            console.log("viewer :",socket.user.id);
        const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
        const room= await user.ActiveRoom.populate("owner");
        const owner = room.owner;
        console.log(owner._id.toString());
        socket.to(owner._id.toString()).emit("askingHostFollowup", {userid});


    })
    socket.on("givingHostcamera",async(data) => {
        const {camera,userid} = data;
             console.log("receiver :",userid);
        socket.to(userid).emit("sendingHostCamera", {camera});


    })
    socket.on("hostcoordinatesent",async(data) => {
        const {world} = data;
        const userid = socket.user.id;
        const user = await User.findById(userid).populate("ActiveRoom");
        const room= user.ActiveRoom;
        
        socket.to(room.roomId).emit("sendingHostCoordinate", {world});


    })


});

app.use('/room', restrictToLoggedinUser, roomrouter);
app.use('/whiteboard', restrictToLoggedinUser, whiteboardrouter);

server.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});