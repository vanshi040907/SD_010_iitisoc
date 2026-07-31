const User = require("../models/user"); 
const Room = require("../models/room");

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
    const user = await User.matchPassword(email,password);
    if(!user) return  res.status(401).json({
    error: "Invalid email or password"
});;
    
    const token = CreateTokenForUser(user);
    res.cookie('uid',token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    
    
    return res.json({Success:"true",token});


}

async function LogoutUser (req,res){
   

    res.clearCookie("uid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

   const userid = req.user.id;
   const user = await User.findById(userid);
   const username = user.userName;
   const roomid = user.ActiveRoom;
   const room = await Room.findById(roomid);
   const Rid = room.roomId;
   if(!room.roomId) return;

   const n = room.participants.length;
  
   for(let i=0;i<n;i++){
   if( room.participants[i].user.toString()===userid.toString()){
    room.participants.splice(i,1);
    room.activeParticipants.splice(i,1);
    
    break;
   }
   }
   

   user.ActiveRoom = null;
   await user.save();
   await room.save();
   

    res.clearCookie("uid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    
    res.json({success:"true",room:Rid,user:username})
}

    
async function GetCurrentUser(req, res) {
      res.set('Cache-Control', 'no-store');
    try{
        const token = req.cookies?.uid;
        if(!token){
            return res.status(401).json({error: "not logged in"});
        }

        const payload = ValidateToken(token);

        const user = await User.findById(payload.id).select("-password -salt");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
    }
    catch(err){
        return res.status(401).json({ error: "Invalid or expired session" });

    }
}


module.exports = {SigninUser,LoginUser,LogoutUser, GetCurrentUser};
