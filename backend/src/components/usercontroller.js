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
const degree = require("./utils/degree")
const moment = require("moment");
const Appointment = require("./schema/appointment")
const nodemailer = require("nodemailer");
const ejs = require("ejs")
const Path = path.resolve(__dirname, "utils/letter.ejs")

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
            const payload = {
                email: findUser.email,
                id: findUser._id,
                fullName: findUser.fullName,
                type: findUser.type
            }
            const token = jwt.sign(payload, secret);
            res.cookie('authorizaton', "abcd", { maxAge: 60000, httpOnly: true });
            return commonfun.sendSuccess(req, res, { message: "login successfull", token: token, type: findUser.type, status: findUser.status })
        }
        const finddoctor = await Doctor.findOne({ email: email });
        if (finddoctor) {
            const password = finddoctor.password;
            const result = await bcrypt.compare(Enteredpassword, password)
            console.log(result);
            if (result == false) {
                return commonfun.sendError(req, res, { message: "wrong password" }, 401)
            }
            const payload = {
                email: finddoctor.email,
                id: finddoctor._id,
                fullName: finddoctor.fullName,
                type: finddoctor.type
            }
            const token = jwt.sign(payload, secret);
            res.cookie('authorizaton', "abcd", { maxAge: 60000, httpOnly: true });
            return commonfun.sendSuccess(req, res, { message: "login successfull", token: token, type: finddoctor.type, status: finddoctor.status })
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
        const token = req.body.token;
        const doctor = jwt.verify(token, secret);
        const id = doctor.id;
        const existingDoctor = await Doctor.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existingDoctor) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        const startShiftTime = req.body.startShiftTime;
        const endShiftTime = req.body.endShiftTime;
        await Doctor.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { image: req.body.image, expertise: req.body.expertise, startShiftTime: req.body.startShiftTime, endShiftTime: req.body.endShiftTime, status: 1, qualification: req.body.qualification, about: req.body.about } });
        return commonfun.sendSuccess(req, res, { message: "added successfully" })
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, error, 500)
    }
}
const uploadImage = async (req, res) => {
    try {
        degree.Upload(req, res, async (err) => {
            if (err) {
                return commonfun.sendError(req, res, { message: err.message }, 400)
            } else {
                console.log(req.body);

                return res.json({ file: req.body.filename })
            }
        });
    } catch (error) {
        return commonfun.sendError(req, res, { message: error.message }, 500)
    }
};

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
        const token = req.body.token;
        const user = jwt.verify(token, secret);
        const id = user.id;
        const existingUser = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!existingUser) {
            return commonfun.sendError(req, res, { message: "invalid token or user not found" }, 401)
        }
        await User.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { contactNumber: req.body.contactNumber, address: req.body.address, image: req.body.image, status: 1, } });
        return commonfun.sendSuccess(req, res, { message: "added successfully" })
    } catch (error) {
        console.log(error);
        return commonfun.sendError(req, res, error, 500)
    }
}

const getUserDetails = async (req, res) => {
    try {
        const token = req.headers.token;
        if(!token){
            return commonfun.sendError(req,res,{message:"enter token"},401)
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
        const date = req.body.date;
        const time = moment(date).format("hh:mm A")
        const formatDate = moment(date).format("DD-MM-YYYY")
        const newappointment = new Appointment({
            userId: existinguser._id,
            doctorId: findDoctor._id,
            date: formatDate,
            time: time,
            reason: req.body.reason
        });
        await newappointment.save();
        // const transport = nodemailer.createTransport({
        //     host: 'smtp.example.com',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: "yugagarwal271@gmail.com",
        //         pass: "rxqs kojb wtdm csmu",
        //     }
        // })
        // const data = {
        //     doctorName: findDoctor.fullName,
        //     date: formatDate,
        //     time: time,
        //     reason: req.body.reason,
        //     patientName: existinguser.fullName
        // }
        // ejs.renderFile(Path, data, async (error, html) => {
        //     if (error) {
        //         console.log(error);
        //         return commonfun.sendError(req, res, error, 500)
        //     }
        //     else {
        //         const info = await transport.sendMail({
        //             from: "yugagarwal214@gmail.com",
        //             to: findDoctor.email,
        //             subject: "appointment booking",
        //             html: html
        //         })
        //         console.log(info);
        //     }
        // })
        return commonfun.sendSuccess(req, res, { message: "appointment scheduled successfully" })
    } catch (error) {
        console.log(error);
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
module.exports = {
    userRegister, userLogin, DecryptData, addDoctorDetails, uploadImage, doctorDetails, addUserDetails, getUserDetails, addAppointment
    , doctorList, appointmentList, fullAppointmentList, deleAppointment, deleAppointment
}
