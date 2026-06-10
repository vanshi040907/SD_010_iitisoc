const shortid = require("shortid");
const Room = require("../models/room");

async function handlecreateRoomId(req,res){
    const body = req.body;
   
    const roomID = shortid(8);
    await Room.create({
        roomId:roomID,
        owner:body.owner,
        participants:[],
    })
    return res.render("home" , `http://localhost:5000/room/${roomID}`);
}



