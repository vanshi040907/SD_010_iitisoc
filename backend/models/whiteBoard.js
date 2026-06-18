const { Schema, model } = require("mongoose");

const whiteBoardSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref:"room",
    },
    type : {
       type: String,
       required: true,
    },
     user: {
      type: Schema.Types.ObjectId,
      ref:"user",
    },
    drawingOperations: [],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    active : {
      type: Boolean,
      default : true,
    },
    
  },
  { timestamps: true },
);

const WhiteBoard = model("whiteBoard" , whiteBoardSchema );
module.exports =  WhiteBoard;