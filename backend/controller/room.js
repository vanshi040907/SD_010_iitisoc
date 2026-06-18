const User = require("../models/user"); 
const Room = require("../models/room");

async function handlecreateRoomId(req,res){
    const {roomID}= req.body;
      const userid = req.user.id;
    const user = await User.findById(req.user.id);
     console.log(user);
   
    
    await Room.create({
        roomId:roomID,
        owner:user,
        participants:[user],
        activeParticipants: [user],
    })
    const room = await Room.findOne({ roomId: roomID});
    user.ActiveRoom = room;
    await user.save();
    

    return res.json({success:"true"});
}
async function UserEnterRoom(req, res) {
    const {roomid} = req.body;
    const userid = req.user._id;
    const user = await User.findOne({_id : userid});
    if(!user) return res.json({error:"invalid user"});
    const room = await Room.findOne({roomId : roomid});
    if(!room) return res.json({error:"invalid roomid"})
        req.io.to(room.owner._id). emit('userjoin', {
    user: user});
    
    return res.json({success:"true"})
    

    
}
async function UserAllowed(req, res) {
    const {roomid} = req.params.roomid;
    const userid = req.user._id;
    const user = await User.findOne({_id : userid});
    const room = await Room.findOne({code : roomid});
    
room.participants.push(user);
await room.save();
user.ActiveRoom = room;
await user.save();

return res.json({success:"true"});

}


module.exports = {handlecreateRoomId,UserEnterRoom,UserAllowed};