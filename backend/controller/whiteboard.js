const User = require("../models/user"); 
const Room = require("../models/room");
const Whiteboard = require("../models/whiteBoard");
async function EventHandling (res, req) {
    const user = req.user;
    const  {type , event}    = req.body;
    const room = user.ActiveRoom;
    const whiteboard = await Whiteboard.create({
        room: room,
        type: type,
        user: user,
        drawingOperations: [event],
    
    });
     req.io.to(room._id). emit('event', {
    whiteboard: whiteboard});
     return res.json({Success:"true"});

}
async function Undo (req, res) {
    const user = req.user;
    
    const room = user.ActiveRoom;
     const whiteboard = await Whiteboard.find({room : room}).sort({ createdAt: 1 });
     const n = whiteboard.length;
     for (let i = n-1; i>=0; i-- ) {
        if(whiteboard[i].active ) {
         whiteboard[i].active = false
         await whiteboard[i].save();
         break;
        }

     } 

    

    
     req.io.to(room._id). emit('event', {
    whiteboard: whiteboard});
     return res.json({Success:"true"});

}
async function Redo (res, req) {
    const user = req.user;
    
    const room = user.ActiveRoom;
     const whiteboard = await Whiteboard.find({room : room}).sort({ createdAt: 1 });
     const n = whiteboard.length;
     for (let i = 0; i< n; i++ ) {
        if(!whiteboard[i].active ) {
         whiteboard[i].active = true
         await whiteboard[i].save();
         break;
        }

     } 


    
     req.io.to(room._id). emit('event', {
    whiteboard: whiteboard});
     return res.json({Success:"true"});

}
module.exports = {EventHandling, Undo , Redo};