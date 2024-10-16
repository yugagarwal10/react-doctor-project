const mongoose = require("mongoose");
const message = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
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
    doctorId: {
        type: mongoose.Types.ObjectId,
        require: true,
    }
},
    { timestamps: true });
module.exports = mongoose.model("message", message);
