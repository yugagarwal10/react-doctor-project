const bcrypt = require("bcrypt");
const User = require("./schema/user");
const Doctor = require("./schema/doctor")
const commonfun = require("./utils/usercommon")
const config = require("config");
const path = require("path")
const secret = config.get("token");
const jwt = require("jsonwebtoken");
const decryptData = require("./utils/decryption");
const { default: mongoose } = require("mongoose");
const moment = require("moment");
const Appointment = require("./schema/appointment")
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const io = require("./utils/socket")
const Path = path.resolve(__dirname, "utils/letter.ejs")
const degree = require("./utils/degree");
const Message = require("./schema/message");
const Chat = require("./schema/chat");
const Ticket = require("./schema/supportticket");
const ApplyTicket = require("./schema/applyticket");
const message = require("./schema/message");
const { log } = require("console");

async function checkUserToken(token, req, res) {
    if (!token) {
        return commonfun.sendError(req, res, { message: "enter token" }, 401)
    }
    const usertoken = token.slice(7);
    const user = jwt.verify(usertoken, secret);
    const id = user.id;
    const existingUser = await User.findOne({ _id: new mongoose.Types.ObjectId(id), status: 1 });
    if (!existingUser) {
        return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
    }
    return existingUser;
}
async function checkDoctorToken(token, req, res) {
    if (!token) {
        return commonfun.sendError(req, res, { message: "enter token" }, 401)
    }
    const usertoken = token.slice(7);
    const user = jwt.verify(usertoken, secret);
    const id = user.id;
    const existingUser = await Doctor.findOne({ _id: new mongoose.Types.ObjectId(id), status: 1 });
    return existingUser;
}
const userRegister = async (req, res) => {
    try {
        const type = req.body.type;
        const password = req.body.password;
        const hash = await bcrypt.hash(password, 10);
        if (type == "user") {
            const newuser = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                password: hash,
                type: req.body.type,
            });
            await newuser.save();
            return commonfun.sendSuccess(req, res, { message: "register successfully" })
        }
        if (type == "doctor") {
            const newdoctor = new Doctor({
                fullName: req.body.fullName,
                email: req.body.email,
                password: hash,
                type: req.body.type,
            });
            await newdoctor.save();
            return commonfun.sendSuccess(req, res, { message: "register successfully" })
        }
        return commonfun.sendError(req, res, { message: "enter type as doctor or user" }, 400)
    } catch (error) {
        return commonfun.sendError(req, res, error, 500)
    }
}
const userLogin = async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return commonfun.sendError(req, res, { message: "enter email" }, 422);
        }
        const Enteredpassword = req.body.password;
        if (!Enteredpassword) {
            return commonfun.sendError(req, res, { message: "enter password" }, 422);
        }

        const findUser = await User.findOne({ email: email });
        if (findUser) {
            const password = findUser.password;
            const result = await bcrypt.compare(Enteredpassword, password);
            if (!result) {
                return commonfun.sendError(req, res, { message: "wrong password" }, 401);
            }
            await User.updateOne({ email: email }, { $set: { status: 1 } });
            const payload = {
                email: findUser.email,
                id: findUser._id,
                fullName: findUser.fullName,
                type: findUser.type
            };
            const token = jwt.sign(payload, secret);
            return commonfun.sendSuccess(req, res, { message: "login successful", token: token, type: findUser.type, isverify: findUser.isverify, id: findUser._id });
        }

        const finddoctor = await Doctor.findOne({ email: email });
        if (finddoctor) {
            const password = finddoctor.password;
            const result = await bcrypt.compare(Enteredpassword, password);
            if (!result) {
                return commonfun.sendError(req, res, { message: "wrong password" }, 401);
            }
            await Doctor.updateOne({ email: email }, { $set: { status: 1 } });
            const payload = {
                email: finddoctor.email,
                id: finddoctor._id,
                fullName: finddoctor.fullName,
                type: finddoctor.type
            };
            const token = jwt.sign(payload, secret);
            return commonfun.sendSuccess(req, res, { message: "login successful", token: token, type: finddoctor.type, isverify: finddoctor.isverify, id: finddoctor._id });
        }

        return commonfun.sendError(req, res, { message: "enter proper email" }, 401);
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, error, 500);
    }
};

const addImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return commonfun.sendError(req, res, { message: "enter file" }, 422)
        }
        const filename = file.filename;
        return res.json(filename)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const UserList = async (req, res) => {
    try {
        const result = await User.find();
        return res.json(result)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const fullAppointmentList = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return commonfun.sendError(req, res, { message: "enter token" }, 401)
        }
        const usertoken = token.slice(7);
        const user = jwt.verify(usertoken, secret);
        const id = user.id;
        const existinguser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (existinguser) {
            const list = await Appointment.aggregate([
                {
                    $match: { userId: existinguser._id }
                },
                {
                    $lookup: {
                        from: "doctors",
                        localField: "doctorId",
                        foreignField: "_id",
                        as: "doctorinfo",
                    },
                },
                {
                    $addFields: {
                        doctorName: { $arrayElemAt: ["$doctorinfo.fullName", 0] }
                    }
                },
                {
                    $project: {
                        doctorinfo: 0
                    }
                }
            ])
            return res.json(list);
        }
        const existingDoctor = await Doctor.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (existingDoctor) {
            const list = await Appointment.aggregate([
                {
                    $match:
                    {
                        $and: [{ $nor: [{ status: 3 }] }, { doctorId: existingDoctor._id }]
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userinfo",
                    },
                },
                {
                    $addFields: {
                        userName: { $arrayElemAt: ["$userinfo.fullName", 0] }
                    }
                },
                {
                    $project: {
                        userinfo: 0
                    }
                }
            ])
            return res.json(list);
        }
    } catch (error) {
        console.log(error);

        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const sendMessage = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const usertoken = token.slice(7);
        const user = jwt.verify(usertoken, secret);     
        const id = user.id;
        const message = req.body.message;
        if (!message) {
            return commonfun.sendError(req, res, { message: "enter message" }, 422)
        }
        const findAdmin = await Doctor.findOne({ role: "super-admin" });
        const date = Date.now();
        const formatedDate = moment(date).format("DD-MM-YYYY");
        const formatedTime = moment(date).format("hh:mm A");
        const findTicket = await ApplyTicket.findOne({ _id: new mongoose.Types.ObjectId(req.body.ticket) })
        if (user.type == "user") {
            const newmessage = new Chat({
                time: formatedTime,
                date: formatedDate,
                message: message,
                senderId: id,
                recieverId: findAdmin._id,
                ticketId: req.body.ticket,
                type: req.body.type,
            });
            await newmessage.save();
        }
        if (user.type == "doctor") {
            const newmessage = new Chat({
                time: formatedTime,
                date: formatedDate,
                message: message,
                senderId: id,
                recieverId: findTicket.userId,
                ticketId: req.body.ticket,
                type: req.body.type,
            });
            await newmessage.save();
        }
        io.io.emit("response", message)
        return commonfun.sendSuccess(req, res, { message: "message send successfully" })
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const getMessage = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const usertoken = token.slice(7);
        const user = jwt.verify(usertoken, secret)
        if (user.type == "user") {
            const messageList = await Chat.find({ ticketId: req.query.ticketId, status: 1, $nor: [{ deletedId: new mongoose.Types.ObjectId(user.id) }] })
            return res.json(messageList);
        }
        if (user.type == "doctor") {
            const messageList = await Chat.find({ ticketId: req.query.ticketId, status: 1, $nor: [{ deletedId: new mongoose.Types.ObjectId(user.id) }] })
            return res.json(messageList);
        }
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}

const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: 1 });
        return res.json(tickets);
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const ticketDetails = async (req, res) => {
    try {
        const ticketId = req.query.ticket;
        const tickets = await Ticket.findOne({ _id: ticketId });
        return res.json(tickets);
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const userTicketDetails = async (req, res) => {
    try {
        const ticketId = req.query.ticket;
        const tickets = await ApplyTicket.findOne({ _id: ticketId });
        return res.json(tickets);
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const getAllTicket = async (req, res) => {
    try {
        const tickets = await ApplyTicket.find();
        return res.json(tickets);
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const getUserAllTicket = async (req, res) => {
    try {
        const tickets = await ApplyTicket.find({ userId: new mongoose.Types.ObjectId(req.query.id) });
        return res.json(tickets);
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const deletemessage = async (req, res) => {
    try {
        const messageId = req.query.id;
        await Chat.updateOne({ _id: new mongoose.Types.ObjectId(messageId) }, { $set: { status: 2 } })
        io.io.emit("response", message)
        return commonfun.sendSuccess(req, res, { message: "deleted successfully" })
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500);
    }
}
const deleteMessageForMe = async (req, res) => {
    try {
        const token=req.headers.authorization
        const usertoken = token.slice(7);
        const user=jwt.verify(usertoken,secret);
        const messageId = req.query.id;
        const alreadyDeleted = await Chat.findOne({ _id: new mongoose.Types.ObjectId(messageId) });
        await Chat.updateOne({ _id: new mongoose.Types.ObjectId(messageId) }, { $set: { deletedId: user.id } })
        io.io.emit("response", "sdcv")
        return commonfun.sendSuccess(req, res, { message: "deleted successfully" })
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500);
    }
}
const seenMessage = async (req, res) => {
    try {
        const token=req.headers.authorization
        const usertoken = token.slice(7);
        const user=jwt.verify(usertoken,secret);
        await Chat.updateMany({ recieverId: new mongoose.Types.ObjectId(user.id), seen: 0 }, { $set: { seen: 1 } })
        io.io.emit("response", "dcfv")
        return commonfun.sendSuccess(req, res, { message: "updated successfully" })
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500);
    }
}
const DecryptData = async (req, res, next) => {
    try {
        const { mac, value } = req.body;

        const data = await decryptData.decryptData(mac, value);

        if (!data) {
            return res.status(500).json({ message: "Decryption failed" });
        }
        req.body = data;
        next();
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500);
    }
};
module.exports = {
    userRegister, userLogin, seenMessage
    , fullAppointmentList, addImage, deletemessage, sendMessage, getMessage, getUserAllTicket,
    UserList, getTickets, ticketDetails, getAllTicket, userTicketDetails, deleteMessageForMe,
    DecryptData
}
