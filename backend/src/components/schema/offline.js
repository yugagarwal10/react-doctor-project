const mongoose = require("mongoose");
const offline = new mongoose.Schema({
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
        default: 0
    },
},
    { timestamps: true });
module.exports = mongoose.model("offine", offline);
