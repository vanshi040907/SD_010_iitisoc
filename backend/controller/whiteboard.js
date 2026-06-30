const User = require("../models/user"); 
const Room = require("../models/room");
const Whiteboard = require("../models/whiteBoard");
const RedoWhiteboard = require("../models/redowhiteBoard");
async function EventHandling (req, res) {
    const userid = req.user.id;
     const user = await User.findById(req.user.id);

    const  { drawingOperations}    = req.body;
    const room = user.ActiveRoom;
    const whiteboard = await Whiteboard.create({
        room: room,
        
        user: userid,
         drawingOperations: drawingOperations,
    
    });

     
     
     return res.json({Success:"true"});

}
async function Undo (req, res) {
        
    
    const userid = req.user.id;
     const user = await User.findById(req.user.id);
    
    const room = user.ActiveRoom;
     const whiteboard = await Whiteboard.find({room : room}).sort({ createdAt:- 1 });
       const n = whiteboard.length;

       const undooperation = whiteboard.drawingOperations;
     for (let i = 0; i< n; i++ ) {
        
       
        if(whiteboard[i].user.toString() === user._id.toString()) {
             
        
         const redoroom = whiteboard[i].room;
         const redouserid = whiteboard[i].user;;
         const redodrawingOperation  = whiteboard[i].drawingOperations;
         await whiteboard[i].deleteOne();
         const redoWhiteBoard = await RedoWhiteboard.create({
          room:redoroom,
          user:redouserid,
          drawingOperations: redodrawingOperation

         })

         
         break;
         
        }

     } 
     const newwhiteboard = await Whiteboard.find({room:room}).sort({createdAt:1});

         const remainingHistory = newwhiteboard.map((w)=> w.drawingOperations).flat();

       const newredowhiteboard = await RedoWhiteboard.find({room:room}).sort({createdAt:1});

       if(!newredowhiteboard) return;

         const remainingRedoHistory = newredowhiteboard.map((w)=> w.drawingOperations).flat();   

         req.io.to(room.toString()).emit("undothis",{remainingHistory:remainingHistory|| [] , remainingRedoHistory:remainingRedoHistory || []});
     return res.json({Success:"true",remainingHistory:remainingHistory || [] , remainingRedoHistory:remainingRedoHistory || []});

}
async function Redo (req, res) {
     const userid = req.user.id;
     const user = await User.findById(req.user.id);
     const room = user.ActiveRoom;
     const redowhiteboard = await RedoWhiteboard.find({room : room}).sort({ createdAt:- 1 });
       const n = redowhiteboard.length;
    
    
    
    for(let i=0;i<n;i++){

      if(redowhiteboard[i].user.toString() === user._id.toString()){
           const undoroom = redowhiteboard[i].room;
         const undouserid = redowhiteboard[i].user;;
         const undodrawingOperation  = redowhiteboard[i].drawingOperations;
         await redowhiteboard[i].deleteOne();
         const whiteboard = await Whiteboard.create({
          room:undoroom,
          user:undouserid,
          drawingOperations: undodrawingOperation


         })

          break;

      }
       
         

    }

   const newwhiteboard = await Whiteboard.find({room:room}).sort({createdAt:1});

         const remainingHistory = newwhiteboard.map((w)=> w.drawingOperations).flat();

       const newredowhiteboard = await RedoWhiteboard.find({room:room}).sort({createdAt:1});

         const remainingRedoHistory = newredowhiteboard.map((w)=> w.drawingOperations).flat();   

         req.io.to(room.toString()).emit("redothis",{remainingHistory:remainingHistory ||[] , remainingRedoHistory:remainingRedoHistory ||[]});
     return res.json({Success:"true",remainingHistory:remainingHistory || [] , remainingRedoHistory:remainingRedoHistory || []});

     
    
     return res.json({Success:"true"});

}
async function Get(req,res) {
      const userid = req.user.id;
     const user = await User.findById(req.user.id);
       const room = user.ActiveRoom;
       const whiteboard = await Whiteboard.find({room:room});
       

               return res.json({data:whiteboard||[]});
     
}



module.exports = {EventHandling, Undo , Redo, Get};