const User = require("../models/user");
const Room = require("../models/room");

async function createRoom(req, res) {
  const io = req.app.get("io");

  io.emit("room-created", {
    roomId: "123",
  });

  return res.json({
    success: true,
  });
}

module.exports = {
  createRoom,
};

async function handlecreateRoomId(req, res) {
  const { roomID } = req.body;
  const userid = req.user.id;
  const user = await User.findById(req.user.id);
  

  await Room.create({
    roomId: roomID,
    owner: user,
    participants: [user],
    activeParticipants: [user],
  });
  const room = await Room.findOne({ roomId: roomID });
  user.ActiveRoom = room;
  await user.save();

  return res.json({ success: "true" });
}

async function UserEnterRoom(req, res) {
  const io = req.app.get("io");
  const { roomid } = req.body;

  const userid = req.user.id;

  const user = await User.findOne({ _id: userid });
  const room = await Room.findOne({ roomId: roomid });
   
  if (!user || !room) {
    return res.status(404).json({
      success: false,
    });
  }
   user.ActiveRoom = room;
     await user.save();

  
  return res.json({
    success: true,
  });

 

  
}
async function UserAllowed(req, res) {
  const { roomid } = req.params.roomid;
  const userid = req.user._id;
  const user = await User.findOne({ _id: userid });
  const room = await Room.findOne({ code: roomid });

  room.participants.push(user);
  await room.save();
  user.ActiveRoom = room;
  await user.save();

  return res.json({ success: "true" });
}

 async function UserLeaveRoom(req,res){
    const {roomid}= req.params.roomid;
    const user = await User.findOne({_id:userid});
    const room = await Room.findOne({code:roomid});

    room.participants.pop(user);
    await room.save();
    await user.save();

    return res.json({success:"true"});
 }
module.exports = { handlecreateRoomId, UserEnterRoom, UserAllowed ,UserLeaveRoom};
