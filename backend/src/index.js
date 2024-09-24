const express = require("express");
const app = express();
const { Server } = require('socket.io');
const cors = require("cors")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/doctor");
const userController = require("./components/usercontroller");
const userValidation = require("./components/uservalidation");
const upload = require("./components/utils/degree")
console.log("server connected");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cors({
  origin: "http://localhost:3000"
}))
app.post("/userRegister", userValidation.validateusersignup, userController.userRegister)
app.post("/userLogin", userController.userLogin)
app.post("/addDoctorDetails", userController.addDoctorDetails)
app.post("/addUserDetails", userController.addUserDetails)
app.patch("/updateUserProfile", userValidation.validateusersignup, userController.updateUserProfile)
app.patch("/updateDoctorProfile", userValidation.validateusersignup, userController.updateDoctorProfile)
app.post("/addAppointment", userValidation.validateAddAppointment, userController.addAppointment)
app.get("/doctorDetails", userController.doctorDetails)
app.get("/getUserDetails", userController.getUserDetails)
app.get("/appointmentList", userController.appointmentList);
app.get("/fullAppointmentList", userController.fullAppointmentList);
app.delete("/deleAppointment", userController.deleAppointment);
app.get("/doctorList", userController.doctorList)
app.post("/DecryptData", userController.DecryptData)
app.post("/confirmAppointment", userController.confirmAppointment)
app.listen(5000, () => {
  console.log("app is running on port 5000");
})
