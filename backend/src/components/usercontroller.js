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
const { log } = require("console");
const Path = path.resolve(__dirname, "utils/letter.ejs")
const degree = require("./utils/degree");
const userimage = require("./utils/userimage")

const userRegister = async (req, res) => {
    try {
        const type = req.body.type;
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
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
            return commonfun.sendError(req, res, { message: "enter email" }, 422)
        }
        const Enteredpassword = req.body.password;
        if (!Enteredpassword) {
            return commonfun.sendError(req, res, { message: "enter passwword" }, 422)
        }
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            const password = findUser.password;
            const result = await bcrypt.compare(Enteredpassword, password)
            if (result == false) {
                return commonfun.sendError(req, res, { message: "wrong password" }, 401)
            }
            await User.updateOne({email:email},{$set:{status:1}})
            const payload = {
                email: findUser.email,
                id: findUser._id,
                fullName: findUser.fullName,
                type: findUser.type
            }
            const token = jwt.sign(payload, secret);
            res.cookie('authorizaton', "abcd", { maxAge: 60000, httpOnly: true });
            return commonfun.sendSuccess(req, res, { message: "login successfull", token: token, type: findUser.type, isverify: findUser.isverify })
        }
        const finddoctor = await Doctor.findOne({ email: email });
        if (finddoctor) {
            const password = finddoctor.password;
            const result = await bcrypt.compare(Enteredpassword, password)
            if (result == false) {
                return commonfun.sendError(req, res, { message: "wrong password" }, 401)
            }
            await Doctor.updateOne({email:email},{$set:{status:1}})
            const payload = {
                email: finddoctor.email,
                id: finddoctor._id,
                fullName: finddoctor.fullName,
                type: finddoctor.type
            }
            const token = jwt.sign(payload, secret);
            res.cookie('authorizaton', "abcd", { maxAge: 60000, httpOnly: true });
            return commonfun.sendSuccess(req, res, { message: "login successfull", token: token, type: finddoctor.type, isverify: finddoctor.isverify })
        }
        return commonfun.sendError(req, res, { message: "enter proper email" }, 401)
    } catch (error) {
        return commonfun.sendError(req, res, error, 500)
    }
}
const DecryptData = async (req, res) => {
    try {
        const { mac, value } = req.body;

        const data = await decryptData.decryptData(mac, value);

        if (!data) {
            return res.status(500).json({ message: "Decryption failed" });
        }
        return res.json(data);
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500);
    }
};
const addDoctorDetails = async (req, res) => {
    try {
        const token = req.headers.token;
        const doctor = jwt.verify(token, secret);
        const id = doctor.id;
        const existingDoctor = await Doctor.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existingDoctor) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        degree.Upload(req, res, async (err) => {
            if (err) {
                return commonfun.sendError(req, res, { message: err.message }, 400)
            } else {
                const startShiftTime = req.body.startShiftTime;
                const endShiftTime = req.body.endShiftTime;
                const formatedStart = moment(startShiftTime, "HH:mm").format("hh:mm A");
                const formatedLast = moment(endShiftTime, "HH:mm").format("hh:mm A");
                if (startShiftTime > endShiftTime) {
                    return commonfun.sendError(req, res, { message: "end time should be greater" }, 422);
                }
                await Doctor.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { image: req.file.filename, expertise: req.body.expertise, startShiftTime: formatedStart, endShiftTime: formatedLast, isverify: 1, qualification: req.body.qualification, about: req.body.about } });
            }
        });
        return commonfun.sendSuccess(req, res, { message: "added successfully" })
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, error, 500)
    }
}
const doctorDetails = async (req, res) => {
    try {
        const token = req.headers.token;
        const doctor = jwt.verify(token, secret);
        const id = doctor.id;
        const existingDoctor = await Doctor.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existingDoctor) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        return commonfun.sendSuccess(req, res, existingDoctor)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const addUserDetails = async (req, res) => {
    try {
        const token = req.headers.token;
        const user = jwt.verify(token, secret);
        const id = user.id;
        const existingUser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existingUser) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        userimage.Upload(req, res, async (err) => {
            if (err) {
                return commonfun.sendError(req, res, { message: err.message }, 400)
            } else {
                await User.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { contactNumber: req.body.contactNumber, address: req.body.address, image: req.file.filename, isverify: 1, } });
            }
        });
        return commonfun.sendSuccess(req, res, { message: "added successfully" })
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, error, 500)
    }
}
const getUserDetails = async (req, res) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return commonfun.sendError(req, res, { message: "enter token" }, 401)
        }
        const user = jwt.verify(token, secret);
        const id = user.id;
        const existinguser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existinguser) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        return commonfun.sendSuccess(req, res, existinguser)
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const addAppointment = async (req, res) => {
    try {
        const token = req.headers.token;
        const user = jwt.verify(token, secret);
        const id = user.id;
        const existinguser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existinguser) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const findDoctor = await Doctor.findOne({ fullName: req.body.doctor });
        const doctorStartTime = findDoctor.startShiftTime;
        const formatedDoctorStartTime = moment(doctorStartTime, "hh:mm A").format("HH:mm");
        const doctorFinishTime = findDoctor.endShiftTime;
        const formatedDoctorEndTime = moment(doctorFinishTime, "hh:mm A").format("HH:mm");
        const date = req.body.date;
        const time = moment(date).format("hh:mm A")
        const properTime = moment(time, "hh:mm A").format("HH:mm");
        const formatDate = moment(date).format("DD-MM-YYYY");
        const todayDate = Date.now();
        const formatedtodayDate = moment(todayDate).add(1, "days").format("DD-MM-YYYY");
        const alreadyAppointmented = await Appointment.findOne({ doctorId: findDoctor._id, status: 0, time: time })
        if (alreadyAppointmented) {
            return commonfun.sendError(req, res, { message: "doctor's appointment already booked" }, 400)
        }
        const findAppointment = await Appointment.findOne({ userId: id, status: 0 })
        if (findAppointment) {
            return commonfun.sendError(req, res, { message: "Complete The Last Appointment First" }, 400)
        }
        if (formatDate < formatedtodayDate) {
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
                console.log(error);
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
const doctorList = async (req, res) => {
    try {
        const result = await Doctor.find();
        return res.json(result)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const appointmentList = async (req, res) => {
    try {
        const token = req.headers.token;
        const user = jwt.verify(token, secret);
        const id = user.id;
        const existinguser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (existinguser) {
            const status = Number(req.headers.status);
            const list = await Appointment.aggregate([
                {
                    $match: { status: status, userId: existinguser._id }
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
            const status = Number(req.headers.status);
            const list = await Appointment.aggregate([
                {
                    $match:
                        { status: status, doctorId: existingDoctor._id }
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
        return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const fullAppointmentList = async (req, res) => {
    try {
        const token = req.headers.token;
        const user = jwt.verify(token, secret);
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
        return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const deleAppointment = async (req, res) => {
    try {
        const token = req.headers.token;
        const user = jwt.verify(token, secret);
        const id = user.id;
        const existinguser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existinguser) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const appointmentId = req.query.id;
        await Appointment.updateOne({ _id: new mongoose.Types.ObjectId(appointmentId) }, { $set: { status: 3 } })
        return commonfun.sendSuccess(req, res, { message: "deleted successfully" })
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const confirmAppointment = async (req, res) => {
    try {
        const token = req.headers.token;
        const user = jwt.verify(token, secret);
        const id = user.id;
        const existinguser = await Doctor.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existinguser) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const response = req.body.response;
        const appointmentId = req.body.appointmentId;
        if (response == "Accept") {
            await Appointment.updateOne({ _id: new mongoose.Types.ObjectId(appointmentId) }, { $set: { status: 1 } })
            return commonfun.sendSuccess(req, res, { message: "accepted successfully" })
        }
        if (response == "Reject") {
            await Appointment.updateOne({ _id: new mongoose.Types.ObjectId(appointmentId) }, { $set: { status: 2 } })
            return commonfun.sendSuccess(req, res, { message: "rejected successfully" })
        }
        return commonfun.sendError(req, res, { message: "enter proper response" }, 422)
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const updateUserProfile = async (req, res) => {
    try {
        const token = req.headers.token;
        const user = jwt.verify(token, secret);
        const id = user.id;
        const existingUser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existingUser) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        await User.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { contactNumber: req.body.contactNumber, address: req.body.address, fullName: req.body.fullName, email: req.body.email } });
        return commonfun.sendSuccess(req, res, { message: "added successfully" })
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const updateDoctorProfile = async (req, res) => {
    try {
        const token = req.headers.token;
        const user = jwt.verify(token, secret);
        const id = user.id;
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
        await Doctor.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { about: req.body.about, qualification: req.body.qualification, fullName: req.body.fullName, email: req.body.email, startShiftTime: formatedStart, endShiftTime: formatedLast } });
        return commonfun.sendSuccess(req, res, { message: "added successfully" })
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
const userLogout = async (req, res) => {
    try {
        const token = req.headers.token;
        const user = jwt.verify(token, secret);
        const id = user.id;
        const existingUser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (existingUser) {
            await User.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { status: 0 } });
            return commonfun.sendSuccess(req, res, { message: "logout successfully" })
        }
        const existingDoctor = await Doctor.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (existingDoctor) {
            await Doctor.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { status: 0 } });
            return commonfun.sendSuccess(req, res, { message: "logout successfully" })
        }
        return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
    } catch (error) {
        console.log(error);
        
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
}
module.exports = {
    userRegister, userLogin, DecryptData, addDoctorDetails, doctorDetails, addUserDetails, getUserDetails, addAppointment
    , doctorList, appointmentList, fullAppointmentList, deleAppointment, deleAppointment, confirmAppointment, updateUserProfile,
    updateDoctorProfile, userLogout
}
