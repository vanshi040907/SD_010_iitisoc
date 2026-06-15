const User = require("../models/user"); 
const Room = require("../models/room");

async function handlecreateRoomId(req,res){
    const {roomID}= req.params.roomid;
     const user = req.user;
   
    
    await Room.create({
        roomId:roomID,
        owner:user,
        participants:[],
    })
    return res.json({success:"true"});
}
async function UserEnterRoom(req, res) {
    const {roomid} = req.body;
    const userid = req.user._id;
    const user = await User.findOne({_id : userid});
    if(!user) return res.json({error:"invalid user"});
    const room = await Room.findOne({code : roomid});
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
return res.json({success:"true"});

}


module.exports = {handlecreateRoomId,UserEnterRoom,UserAllowed};