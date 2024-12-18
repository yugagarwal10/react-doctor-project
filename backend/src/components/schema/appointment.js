const mongoose = require("mongoose");
const appointment = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    doctorId:{
        type: mongoose.Types.ObjectId,
        require: true,
    },
    reason:{
        type:String,
        require:true
    },
    date:{
        type:String,
        require: true,
    },
    time:{
        type:String,
        require: true,
    },
    status:{
        type:Number,
        default:0,
    }
},
    { timestamps: true });
module.exports = mongoose.model("appointment", appointment);
