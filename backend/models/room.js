const {Schema , model} = require("mongoose");

const roomSchema = new Schema({
    roomId:{
        type:String,
        required:true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required:true,
    },
    participants:[{
        type: Schema.Types.ObjectId,
        ref: "user",
    }],
    activeParticipants:[{
        type: Schema.Types.ObjectId,
        ref: "user",
    }],
},{timestamps: true}

)

const Room = model("room" ,roomSchema );
module.exports = Room;

