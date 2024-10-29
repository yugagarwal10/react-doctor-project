const commonController = require("../components/commoncontroller");
const userValidation = require("../components/uservalidation");
const { uploadDoctorDegree, uploadUserImage, uploadTicketImage, uploadChatImage } = require("../components/utils/degree")
const express = require("express");
const router=express.Router();

router.post("/userRegister", commonController.DecryptData, userValidation.validateusersignup, commonController.userRegister)
router.post("/userLogin", commonController.DecryptData, userValidation.validateuserLogin, commonController.userLogin)
router.post("/sendMessage", commonController.DecryptData, commonController.sendMessage)
router.post("/addDoctorImage", uploadDoctorDegree.single("image"), commonController.addImage)
router.post("/uploadChatImage", uploadChatImage.single("image"), commonController.addImage)
router.post("/addTicketImage", uploadTicketImage.single("image"), commonController.addImage)
router.post("/addUserImage", uploadUserImage.single("image"), commonController.addImage)
router.get("/fullAppointmentList", commonController.fullAppointmentList);
router.delete("/deletemessage", commonController.deletemessage);
router.delete("/deleteMessageForMe", commonController.deleteMessageForMe);
router.patch("/seenMessage", commonController.seenMessage);
router.get("/UserList", commonController.UserList)
router.get("/getTickets", commonController.getTickets)
router.get("/getUserAllTicket", commonController.getUserAllTicket)
router.get("/ticketDetails", commonController.ticketDetails)
router.get("/userTicketDetails", commonController.userTicketDetails)
router.get("/getAllTicket", commonController.getAllTicket)
router.get("/getMessage", commonController.getMessage)

module.exports=router