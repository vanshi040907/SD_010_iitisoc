const { Schema, model } = require("mongoose");

const whiteBoardSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref:"room",
    },
    
     user: {
      type: Schema.Types.ObjectId,
      ref:"user",
    },
     drawingOperations: [{}],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    
    
  },
  { timestamps: true },
);

const WhiteBoard = model("whiteBoard" , whiteBoardSchema );
module.exports =  WhiteBoard;