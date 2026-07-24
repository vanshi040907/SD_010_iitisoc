const {Schema , model} = require("mongoose");

const roomSchema = new Schema({
    roomId:{
        type:String,
        required:true,
    },
    hostpermission : {
         type: Boolean,
      default: false,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required:true,
    },
    participants:[{
        user:{
        type: Schema.Types.ObjectId,
        ref: "user",
    },
     role:{
        type:String,
        enum:["Host","Viewer","Editor"],
        default:"Editor",

     },
     enabled:{
        type:Boolean,
        default:true
     }
    
}],
    activeParticipants:[{
        type: Schema.Types.ObjectId,
        ref: "user",
    }],
},{timestamps: true}

)

const Room = model("room" ,roomSchema );
module.exports = Room;

