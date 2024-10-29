const mongoose = require("mongoose");
const chat = new mongoose.Schema({
    message: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true,
    },
    time: {
        type: String,
        require: true,
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    recieverId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    ticketId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    type: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        default: 1
    },
    seen: {
        type: Number,
        default: 0
    },
    deletedId:{
        type: mongoose.Types.ObjectId,
    }
},
    { timestamps: true });
module.exports = mongoose.model("chat", chat);
