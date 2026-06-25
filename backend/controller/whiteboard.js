const User = require("../models/user"); 
const Room = require("../models/room");
const Whiteboard = require("../models/whiteBoard");
async function EventHandling (req, res) {
    const userid = req.user.id;
     const user = await User.findById(req.user.id);

    const  { drawingOperations}    = req.body;
    const room = user.ActiveRoom;
    const whiteboard = await Whiteboard.create({
        room: room,
        
        user: user,
         drawingOperations: drawingOperations,
    
    });
     req.io.to(room._id). emit('event', {
    whiteboard: whiteboard});
    
     return res.json({Success:"true"});

}
async function Undo (req, res) {
        
    
    const userid = req.user.id;
     const user = await User.findById(req.user.id);
    
    const room = user.ActiveRoom;
     const whiteboard = await Whiteboard.find({room : room}).sort({ createdAt:- 1 });
       const n = whiteboard.length;
     for (let i = 0; i< n; i++ ) {
        
       
        if(whiteboard[i].user.toString()===user._id.toString()) {
             
        
         
         await whiteboard[i].deleteOne();
         break;
         
        }

     } 

     


    

    
     req.io.to(room._id). emit('event', {
    whiteboard: whiteboard});
     return res.json({Success:"true"});

}
async function Redo (req, res) {
     const userid = req.user.id;
     const user = await User.findById(req.user.id);
       const  { drawingOperations}    = req.body;
    
    const room = user.ActiveRoom;
     const whiteboard = await Whiteboard.create({
        room: room,
        
        user: user,
         drawingOperations: drawingOperations,
    
    });
     req.io.to(room._id). emit('event', {
    whiteboard: whiteboard});
    console.log("hi")
     return res.json({Success:"true"});

}
module.exports = {EventHandling, Undo , Redo};