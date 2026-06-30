const { Schema, model } = require("mongoose");

const redoWhiteboardSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref:"room",
    },
    
     user: {
      type: Schema.Types.ObjectId,
      ref:"user",
    },
     drawingOperations: {
       type: [Schema.Types.Mixed],
      default: [],

     },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    
    
  },
  { timestamps: true },
);

const RedoWhiteboard = model("redoWhiteboard" , redoWhiteboardSchema );
module.exports = RedoWhiteboard;