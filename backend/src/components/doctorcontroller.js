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
const addDoctorDetails = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const info = await checkDoctorToken(token, req, res);
        if (!info) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const startShiftTime = req.body.startShiftTime;
        const endShiftTime = req.body.endShiftTime;
        const formatedStart = moment(startShiftTime, "HH:mm").format("hh:mm A");
        const formatedLast = moment(endShiftTime, "HH:mm").format("hh:mm A");
        if (startShiftTime > endShiftTime) {
            return commonfun.sendError(req, res, { message: "end time should be greater" }, 422);
        }
        const result = await Doctor.updateOne({ _id: new mongoose.Types.ObjectId(info._id) }, { $set: { image: req.body.image, expertise: req.body.expertise, startShiftTime: formatedStart, endShiftTime: formatedLast, isverify: 1, qualification: req.body.qualification, about: req.body.about } });
        return commonfun.sendSuccess(req, res, { message: "added successfully" })
    } catch (error) {
        return commonfun.sendError(req, res, error, 500)
    }
}
const doctorDetails = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const existingDoctor = await checkDoctorToken(token, req, res);
        if (!existingDoctor) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        return commonfun.sendSuccess(req, res, existingDoctor)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const doctorList = async (req, res) => {
    try {
        const result = await Doctor.find();
        return res.json(result)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const confirmAppointment = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const doctor = await checkDoctorToken(token, req, res);
        if (!doctor) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const response = req.body.response;
        const appointmentId = req.body.appointmentId;
        const findAppointment = await Appointment.findOne({ _id: new mongoose.Types.ObjectId(appointmentId) });
        const date = Date.now();
        const formatedDate = moment(date).format("DD-MM-YYYY");
        const formatedTime = moment(date).format("hh:mm A");
        const userId = findAppointment.userId;
        if (response == "Accept") {
            await Appointment.updateOne({ _id: new mongoose.Types.ObjectId(appointmentId) }, { $set: { status: 1 } })
            const newmessage = new Message({
                userId: userId,
                doctorId: doctor._id,
                message: response,
                time: formatedTime,
                date: formatedDate
            })
            const id = userId.toString();
            io.io.emit(`response ${id}`, response)
            await newmessage.save();
            return commonfun.sendSuccess(req, res, { message: "accepted successfully" })
        }
        if (response == "Reject") {
            await Appointment.updateOne({ _id: new mongoose.Types.ObjectId(appointmentId) }, { $set: { status: 2 } });
            const newmessage = new Message({
                userId: findAppointment.userId,
                doctorId: doctor._id,
                message: response,
                time: formatedTime,
                date: formatedDate
            })
            const id = findAppointment.userId.toString();;
            io.io.emit(`response ${id}`, response)
            await newmessage.save();
            return commonfun.sendSuccess(req, res, { message: "rejected successfully" })
        }
        return commonfun.sendError(req, res, { message: "enter response as Accept or Reject" }, 422)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const updateDoctorProfile = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const info = await checkDoctorToken(token, req, res);
        if (!info) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const id = info._id;
        const existingUser = await Doctor.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existingUser) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const startShiftTime = req.body.startShiftTime;
        const endShiftTime = req.body.endShiftTime;
        const formatedStart = moment(startShiftTime, "HH:mm").format("hh:mm A");
        const formatedLast = moment(endShiftTime, "HH:mm").format("hh:mm A");
        if (startShiftTime > endShiftTime) {
            return commonfun.sendError(req, res, { message: "end time should be greater" }, 422);
        }
        const data = {};
        if (req.body.startShiftTime) {
            data.startShiftTime = formatedStart
        }
        if (req.body.endShiftTime) {
            data.endShiftTime = formatedLast
        }
        if (req.body.about) {
            data.about = req.body.about
        }
        if (req.body.qualification) {
            data.qualification = req.body.qualification
        }
        if (req.body.fullName) {
            data.fullName = req.body.fullName
        }
        if (req.body.email) {
            data.email = req.body.email
        }
        await Doctor.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: data });
        return commonfun.sendSuccess(req, res, { message: "added successfully" })
    } catch (error) {
        console.log(error);

        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const doctorLogout = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const doctorinfo = await checkDoctorToken(token, req, res);
        if (!doctorinfo) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const doctorId = doctorinfo._id;
        await Doctor.updateOne({ _id: new mongoose.Types.ObjectId(doctorId) }, { $set: { status: 0 } });
        return commonfun.sendSuccess(req, res, { message: "logout successfully" })
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const addTickets = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const userinfo = await checkDoctorToken(token, req, res);
        if (!userinfo) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const id = userinfo._id;
        const type = req.body.type;
        if (!type) {
            return commonfun.sendError(req, res, { message: "enter type" }, 422)
        }
        const newticket = new Ticket({
            adminId: id,
            type: type,
            email: userinfo.email,
        })
        await newticket.save();
        return commonfun.sendSuccess(req, res, { message: "saved successfully" })
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const sendResponse = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const doctor = await checkDoctorToken(token, req, res);
        if (!doctor) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const response = req.body.response;
        const reply = req.body.reply
        if (!reply) {
            return commonfun.sendError(req, res, { message: "enter response" }, 422)
        }
        const TicketId = req.body.TicketId;
        if (response == "Accept") {
            await ApplyTicket.updateOne({ _id: new mongoose.Types.ObjectId(TicketId) }, { $set: { status: 1, response: reply } })
            return commonfun.sendSuccess(req, res, { message: "accepted successfully" })
        }
        if (response == "Reject") {
            await ApplyTicket.updateOne({ _id: new mongoose.Types.ObjectId(TicketId) }, { $set: { status: 2, response: reply } });
            return commonfun.sendSuccess(req, res, { message: "rejected successfully" })
        }
        return commonfun.sendError(req, res, { message: "enter response as Accept or Reject" }, 422)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500);
    }
}
module.exports = {
    addDoctorDetails, doctorDetails, doctorList, confirmAppointment, updateDoctorProfile, doctorLogout, addTickets, sendResponse,
}
