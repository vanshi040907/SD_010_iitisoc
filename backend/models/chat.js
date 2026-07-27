const {Schema , model} = require("mongoose");

const chatSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref:"room",
        required:true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref:"user",
        required:true
    },

    userName: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    sentAt: {
        type: Date,
        default: Date.now,
    },

},
{ timestamps: true },
);

chatSchema.index({ room: 1, sendAt:1 });


const Chat = model("chat",chatSchema);
module.exports = Chat;