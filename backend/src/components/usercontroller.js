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
const addUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const info = await checkUserToken(token, req, res);
        await User.updateOne({ _id: new mongoose.Types.ObjectId(info._id) }, { $set: { contactNumber: req.body.contactNumber, address: req.body.address, image: req.body.image, isverify: 1, } });
        return commonfun.sendSuccess(req, res, { message: "added successfully" })
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, error, 500)
    }
}
const getUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const existinguser = await checkUserToken(token, req, res)
        return commonfun.sendSuccess(req, res, existinguser)
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const addAppointment = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const existinguser = await checkUserToken(token, req, res);
        const doctorName = req.body.doctor;
        const findDoctor = await Doctor.findOne({ fullName: req.body.doctor });
        if (!findDoctor) {
            return commonfun.sendError(req, res, { message: "no doctor found" }, 400)
        }
        const doctorStartTime = findDoctor.startShiftTime;
        const formatedDoctorStartTime = moment(doctorStartTime, "hh:mm A").format("HH:mm");
        const doctorFinishTime = findDoctor.endShiftTime;
        const formatedDoctorEndTime = moment(doctorFinishTime, "hh:mm A").format("HH:mm");
        const date = req.body.date;
        const time = moment(date).format("hh:mm A")
        const properTime = moment(time, "hh:mm A").format("HH:mm");
        const formatDate = moment(date).format("DD-MM-YYYY");
        const formatCheckDate = moment(date).format("YYYY-MM-DD");
        const todayDate = Date.now();
        const formatedtodayDate = moment(todayDate).add(1, "days").format("YYYY-MM-DD");
        const alreadyAppointmented = await Appointment.findOne({ doctorId: findDoctor._id, status: 0, time: time })
        if (alreadyAppointmented) {
            return commonfun.sendError(req, res, { message: "doctor's appointment already booked" }, 400)
        }
        const findAppointment = await Appointment.findOne({ userId: existinguser._id, status: 0 })
        if (findAppointment) {
            return commonfun.sendError(req, res, { message: "Complete The Last Appointment First" }, 400)
        }
        if (formatCheckDate < formatedtodayDate) {
            return commonfun.sendError(req, res, { message: "enter proper date" }, 422)
        }
        if (properTime < formatedDoctorStartTime) {
            return commonfun.sendError(req, res, { time: `Doctor starting timing is ${doctorStartTime} ` }, 422)
        }
        if (properTime > formatedDoctorEndTime) {
            return commonfun.sendError(req, res, { time: `Doctor Ending  timing is ${doctorFinishTime}` }, 422)
        }
        const newappointment = new Appointment({
            userId: existinguser._id,
            doctorId: findDoctor._id,
            date: formatDate,
            time: time,
            reason: req.body.reason
        });
        await newappointment.save();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "yugagarwal271@gmail.com",
                pass: "rxqs kojb wtdm csmu",
            }
        })
        const data = {
            doctorName: findDoctor.fullName,
            date: formatDate,
            time: time,
            reason: req.body.reason,
            patientName: existinguser.fullName
        }
        ejs.renderFile(Path, data, async (error, html) => {
            if (error) {
                return commonfun.sendError(req, res, { message: error.message }, 500)
            }
            else {
                const info = await transport.sendMail({
                    from: "yugagarwal214@gmail.com",
                    to: findDoctor.email,
                    subject: "appointment booking",
                    html: html
                })
            }
        })
        return commonfun.sendSuccess(req, res, { message: "appointment scheduled successfully" })
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const deleAppointment = async (req, res) => {
    try {
        const token = req.headers.authorization;
        await checkUserToken(token, req, res);
        const appointmentId = req.query.id;
        if (!appointmentId) {
            return commonfun.sendError(req, res, { message: "enter appointmentId" }, 422)
        }
        const result = await Appointment.updateOne({ _id: new mongoose.Types.ObjectId(appointmentId), status: 0 }, { $set: { status: 3 } })
        if (result.matchedCount == 0) {
            return commonfun.sendError(req, res, { message: "enter proper details" }, 400)
        }
        return commonfun.sendSuccess(req, res, { message: "deleted successfully" })
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const updateUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const info = await checkUserToken(token, req, res);
        const id = info._id;
        const existingUser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existingUser) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const data = {};

        if (req.body.contactNumber) {
            data.contactNumber = req.body.contactNumber;
        }

        if (req.body.address) {
            data.address = req.body.address;
        }

        if (req.body.fullName) {
            data.fullName = req.body.fullName;
        }

        if (req.body.email) {
            data.email = req.body.email;
        }
        await User.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: data });
        return commonfun.sendSuccess(req, res, { message: "updated successfully" })
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const userLogout = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const userinfo = await checkUserToken(token, req, res);
        const id = userinfo._id;
        await User.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { status: 0 } });
        return commonfun.sendSuccess(req, res, { message: "logout successfully" });
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const applyticket = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const userinfo = await checkUserToken(token, req, res);
        const id = userinfo.id;
        const newapply = new ApplyTicket({
            userId: id,
            email: userinfo.email,
            reason: req.body.reason,
            title: req.body.title,
            ticketId: req.body.ticketId,
            photo: req.body.photo,
        });
        await newapply.save();
        return commonfun.sendSuccess(req, res, { message: "applied successfully" });
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
module.exports = {
    addUserDetails, getUserDetails, addAppointment
    , deleAppointment, deleAppointment, updateUserProfile, userLogout, applyticket
}
