const User = require("../models/user");
const Room = require("../models/room");



async function handlecreateRoomId(req, res) {
  const { roomID } = req.body;
  const userid = req.user.id;
  const user = await User.findById(req.user.id);
  

  await Room.create({
    roomId: roomID,
    owner: userid,
    participants: [userid],
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

  
  const room = await Room.findOne({ roomId: roomid })
                
  
  if (!user || !room) {
    return res.status(404).json({
      success: false,
    });
  }

  user.ActiveRoom = room._id;
  await user.save();
  room.participants.push(userid);
  await room.save();
  room.activeParticipants.push(userid);
  await room.save();

  
  return res.json({
    success: true,
  });

 

  
}


 async function UserLeaveRoom(req,res){
   const userid = req.user.id;
   const user = await User.findById(userid);
   const roomid = user.ActiveRoom;
   const room = await Room.findById(roomid);
   const n = room.participants.length;
  
   for(let i=0;i<n;i++){
   if( room.participants[i].toString()===userid.toString()){
    room.participants.splice(i,1);
    room.activeParticipants.splice(i,1);
    
    break;
   }
   }
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
    { path: "participants" }]);
    const owner = room.owner.userName;
    const participants = room.participants;
    const member_name = participants.map((x) => x.userName);
     return res.json({owner:owner,
      mem:member_name
     });

  
 }
module.exports = { handlecreateRoomId, UserEnterRoom ,UserLeaveRoom,Name };
