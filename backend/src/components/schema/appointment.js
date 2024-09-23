const mongoose = require("mongoose");
const appointment = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        require: true,
        lowercase: true
    },
    doctorId:{
        type: mongoose.Types.ObjectId,
    },
    reason:{
        type:String,
        require:true
    },
    date:{
        type:String,
    },
    time:{
        type:String,
    },
    status:{
        type:Number,
        default:0,
    }
},
    { timestamps: true });
module.exports = mongoose.model("appointment", appointment);
