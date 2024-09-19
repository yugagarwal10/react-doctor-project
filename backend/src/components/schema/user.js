const mongoose = require("mongoose");
const user = new mongoose.Schema({
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
    address: {
        type: String
    },
    contactNumber: {
        type: Number
    }
},
    { timestamps: true });
module.exports = mongoose.model("user", user);
