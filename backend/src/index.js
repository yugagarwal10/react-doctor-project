const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});
// io.on('connection', (socket) => {
//   socket.on("user-message", (message) => {
//     io.emit("user-message", message)
//   })
//   socket.on("doctor-message", (message) => {
//     console.log("doctor-message",message)
//     io.emit("doctor-message", message)
//   })
// });
server.listen(4000, () => {
  console.log("server is running on port 4000")
})
const cors = require("cors")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/doctor");
const userController = require("./components/usercontroller");
const userValidation = require("./components/uservalidation");
const { uploadDoctorDegree, uploadUserImage } = require("./components/utils/degree")
console.log("server connected");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cors({
  origin: "http://localhost:3000"
}))
app.post("/userRegister", userController.DecryptData, userValidation.validateusersignup, userController.userRegister)
app.post("/userLogin", userController.DecryptData, userValidation.validateuserLogin, userController.userLogin)
app.post("/addDoctorDetails", userController.DecryptData, userValidation.validateDoctorProfile, userController.addDoctorDetails)
app.post("/addUserDetails", userController.DecryptData, userValidation.validateUserProfile, userController.addUserDetails)
app.patch("/updateUserProfile", userController.DecryptData, userValidation.validateUserupdate, userController.updateUserProfile)
app.patch("/updateDoctorProfile", userController.DecryptData, userValidation.validateDoctorupdate, userController.updateDoctorProfile)
app.post("/addAppointment", userController.DecryptData, userValidation.validateAddAppointment, userController.addAppointment)
app.post("/sendMessage", userController.DecryptData,userController.sendMessage)
app.get("/doctorDetails", userController.doctorDetails)
app.get("/getUserDetails", userController.getUserDetails);
app.post("/addDoctorImage", uploadDoctorDegree.single("image"), userController.addImage)
app.post("/addUserImage", uploadUserImage.single("image"), userController.addImage)
app.get("/fullAppointmentList", userController.fullAppointmentList);
app.delete("/deleAppointment", userController.DecryptData, userController.deleAppointment);
app.get("/doctorList", userController.doctorList)
app.get("/userLogout", userController.userLogout)
app.get("/doctorLogout", userController.doctorLogout)
app.get("/getMessage", userController.getMessage)
app.post("/confirmAppointment", userController.DecryptData, userValidation.validateConfirmAppointment, userController.confirmAppointment)
app.listen(5000, () => {
  console.log("app is running on port 5000");
})
exports.io=io