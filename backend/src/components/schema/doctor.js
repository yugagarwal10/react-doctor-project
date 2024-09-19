const mongoose = require("mongoose");
const doctor = new mongoose.Schema({
    fullName: {
        type: String,
        require: true,
        lowercase: true
    },
    email: {
        type: String,
        require: true,
        lowercase: true
    },
    password: {
        type: String,
        require: true,
    },
    status: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        require: true,
        lowercase: true
    },
    image: {
        type: String,
    },
    expertise: [{
        type: String,
    }],
    qualification:{
        type:String,
    },
    startShiftTime: {
        type: String,
    },
    endShiftTime: {
        type: String,
    },
    about:{
        type:String,
    }
},
    { timestamps: true });
module.exports = mongoose.model("doctor", doctor);
