const User = require("../models/user");
const Room = require("../models/room");



async function handlecreateRoomId(req, res) {
  const { roomID,hostpermission } = req.body;
  const userid = req.user.id;
  const user = await User.findById(req.user.id);
  

  await Room.create({
    roomId: roomID,
    hostpermission:hostpermission,
    owner: userid,
    participants: [{user:userid,role:"Host"}],
    activeParticipants: [userid],
  });
  const room = await Room.findOne({ roomId: roomID });
  user.ActiveRoom = room._id;
  await user.save();

  return res.json({ success: "true" });
}

async function UserEnterRoom(req, res) {
  
  const { roomid } = req.body;

  const userid = req.user.id;
   const user = await User.findById(req.user.id);

  
  const room = await Room.findOne({ roomId: roomid }).populate([{ path: "owner" },
    { path: "activeParticipants" }]); 
    const activeParticipants = room.activeParticipants;

                
  
  if (!user || !room) {
    return res.status(404).json({
      success: false,
    });
  }
  
  const host = room.owner;

  if(!room.hostpermission) {

  user.ActiveRoom = room._id;
  await user.save();
  room.participants.push({user:userid,role:"Viewer"});
  await room.save();
  room.activeParticipants.push(userid);
  await room.save();

  
  return res.json({
    success: true,
  });
}
const present = activeParticipants.some((p) => p._id.toString() === host._id.toString())
if(!present) {
  return res.status(404).json({
      success: false,
    });

}


req.io.to(host._id.toString()).emit("userinfo",{user:user,roomid:roomid});
return res.json({
    success: false,
    pending: true,
    message: "waiting for host approval",
  });

 

  
}
async function Allowance(req,res) {
  console.log("ggggg");
  
  const {access,roomid,user} = req.body;
   const room = await Room.findOne({ roomId: roomid });
   const newuser = await User.findById(user._id)

  newuser.ActiveRoom = room._id;
  await newuser.save();
  room.participants.push({user:newuser._id,role:access});
  

  await room.save();
  room.activeParticipants.push(newuser._id);
  await room.save();

  req.io.to(user._id.toString()).emit("allow",{access:access});
  return res.json({
    success: true,
  });


  
}
async function Denial(req,res) {
  const {user} = req.body;
  req.io.to(user._id.toString()).emit("deny",{response:"no"});
  return res.json({
    success: true,
  });


  
}



 async function UserLeaveRoom(req,res){
   const userid = req.user.id;
   const user = await User.findById(userid);
   const username = user.userName;
   const roomid = user.ActiveRoom;
   const room = await Room.findById(roomid);
   const Rid = room.roomId;

   const n = room.participants.length;
  
   for(let i=0;i<n;i++){
   if( room.participants[i].user.toString()===userid.toString()){
    room.participants.splice(i,1);
    room.activeParticipants.splice(i,1);
    
    break;
   }
   }
   req.io.to(Rid.toString()).emit("leave me!",{username});

   user.ActiveRoom = null;
   user.save();
   room.save();
   
    return res.json({success:"true"});
 }
 async function Name(req,res) {
    const userid = req.user.id;
   const user = await User.findById(userid)
                  .populate("ActiveRoom");
                  if(user.ActiveRoom === null) return;
    
    const room= await user.ActiveRoom.populate([{ path: "owner" },
    { path: "participants.user" }]);
    const owner = room.owner.userName;
    const participants = room.participants;
    const member_name = participants.map((x) => ({name:x.user.userName,role:x.role}));
     return res.json({owner:owner,
      mem:member_name
     });

  
 }
module.exports = { handlecreateRoomId, UserEnterRoom ,UserLeaveRoom,Name ,Allowance,Denial};
