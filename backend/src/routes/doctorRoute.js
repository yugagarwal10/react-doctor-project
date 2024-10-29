const doctorController = require("../components/doctorcontroller");
const commonController=require("../components/commoncontroller")
const userValidation = require("../components/uservalidation");
const express = require("express");
const router=express.Router();

router.post("/confirmAppointment", commonController.DecryptData, userValidation.validateConfirmAppointment, doctorController.confirmAppointment);
router.get("/doctorLogout", doctorController.doctorLogout);
router.get("/doctorList", doctorController.doctorList);
router.post("/sendResponse", commonController.DecryptData, doctorController.sendResponse);
router.post("/addTickets", doctorController.addTickets)
router.get("/doctorDetails", doctorController.doctorDetails);
router.post("/addDoctorDetails", commonController.DecryptData, userValidation.validateDoctorProfile, doctorController.addDoctorDetails)
router.patch("/updateDoctorProfile", commonController.DecryptData, userValidation.validateDoctorupdate, doctorController.updateDoctorProfile);

module.exports=router;
