const {Schema , model} = require("mongoose");

const roomSchema = new Schema({
    roomId:{
        type:String,
        required:true,
    },
    owner:{
        type:String,
        required:true,
    },
    participants:[]
},{timestamps: true}

)

const Room = model("room" ,roomSchema );
module.exports = Room;

