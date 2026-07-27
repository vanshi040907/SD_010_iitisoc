const {Router} = require("express");
const router = Router();
const Chat = require('../models/chat');
const Room = require('../models/room'); 

//Get/ api/rooms/:roomId/chats

router.get('/rooms/:roomId/chats', async (req, res) => {
  try{
    const {roomId} = req.params;

    const room = await Room.findOne({roomId});
    if(!room){
        return res.status(404).json({error: "Room does not exist."})
    }

    const chats = await Chat.find({room: room._id})
    .sort({sendAt: -1})
    .limit(200);

    chats.reverse();

    res.json(chats);
  }
  catch(err){
    console.error("Error fetching chats:", err);
    res.status(500).json({error:"failed to fetch chat history"})
  }
});


module.exports = router;
