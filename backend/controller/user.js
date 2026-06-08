const User = require("../models/user"); 
const {CreateTokenForUser,ValidateToken} = require("../service/auth")
async function SigninUser(req,res) {
    const {userName,email, password} = req.body;
    await User.create({
        userName,
        email,
        password,

    });
    return res.json({Success:"true"});


}
async function LoginUser(req,res) {
    const {email, password} = req.body;
    const user = User.matchPassword(email,password);
    if(!user) return res.json({error:"invalid email or password"});
    return
    const token = CreateTokenForUser(user);
    
    
    return res.json({Success:"true"},token);


}
async function UserEnterRoom(req, res) {
    const {roomid} = req.body;
    const userid = req.user._id;
    const user = await User.findOne({_id : userid});
    if(!user) return res.json({error:"invalid user"});
    const room = await User.findOne({code : roomid});
    if(!room) return res.json({error:"invalid roomid"})
    
    return res.json({user:room.author,room_id: roomid})

    

}
async function UserAllowed(req, res) {
    const {roomid} = req.params.roomid;
    const userid = req.user._id;
    const user = await User.findOne({_id : userid});
    const room = await User.findOne({code : roomid});
    
room.participants.push(user);
await room.save();
return res.json({success:"true"});


    



    

}


module.exports = {SigninUser,LoginUser};
