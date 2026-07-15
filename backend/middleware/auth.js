const { ValidateToken } = require("../service/auth");
const User = require("../models/user"); 
const Room = require("../models/room");
const Whiteboard = require("../models/whiteBoard");
const RedoWhiteboard = require("../models/redowhiteBoard");
function  restrictToLoggedinUser(req,res,next) {
     const useruid = req.cookies?.uid;
    if(!useruid) return res.status(401).json({ error: "Login required" });
    const user = ValidateToken(useruid);
    if(!user) return res.status(401).json({ error: "Login required" });
    req.user=user;
    next();
}
async function  requiredEditorAccess(req,res,next) {
              
                const userid = req.user.id;
   const user = await User.findById(userid)
                  .populate("ActiveRoom");
                  if(user.ActiveRoom === null) return res.status(403).json({ error: "Dont have Editor access" });
    
    const room= await user.ActiveRoom.populate([{ path: "owner" },
    { path: "participants.user" }]);
    const participants = room.participants;
    const m = participants.some((x) => x.user._id.toString()===userid.toString()&&(x.role==="Editor"||x.role==="Host"));

     
    if(!m) return res.status(403).json({ error: "Dont have Editor access" });

    next();
}
module.exports = {
    restrictToLoggedinUser,
    requiredEditorAccess
};