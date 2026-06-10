const { Schema, model } = require("mongoose");

const whiteBoardSchema = new Schema(
  {
    roomCode: {
      type: String,
      required: true,
    },
    drawingOperations: [],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const WhiteBoard = model("whiteBoard" , whiteBoardSchema );
module.exports =  WhiteBoard;