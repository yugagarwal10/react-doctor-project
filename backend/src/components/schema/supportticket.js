const mongoose = require("mongoose");
const ticket = new mongoose.Schema({
    type: {
        type: String,
        require: true
    },
    adminId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    email: {
        type: String,
        require: true,
    },
    status:{
        type:Number,
        default:1,
    },
},
    { timestamps: true });
module.exports = mongoose.model("supportTicket", ticket);
