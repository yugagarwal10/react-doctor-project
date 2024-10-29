const mongoose = require("mongoose");
const applyticket = new mongoose.Schema({
    reason: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    ticketId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        require: true,
    },
    userId:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: Number,
        default: 0,
    },
    photo:{
        type:String,
        require:true,
    },
    response:{
        type:String,
    }
},
    { timestamps: true });
module.exports = mongoose.model("applyticket", applyticket);
