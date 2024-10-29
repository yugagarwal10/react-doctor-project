const userController = require("../components/usercontroller");
const commonController=require("../components/commoncontroller")
const userValidation = require("../components/uservalidation");
const express = require("express");
const router=express.Router();

router.post("/addUserDetails", commonController.DecryptData, userValidation.validateUserProfile, userController.addUserDetails);
router.patch("/updateUserProfile", commonController.DecryptData, userValidation.validateUserupdate, userController.updateUserProfile)
router.post("/addAppointment", commonController.DecryptData, userValidation.validateAddAppointment, userController.addAppointment)
router.post("/applyticket", commonController.DecryptData, userController.applyticket)
router.get("/Logout", userController.userLogout)
router.delete("/deleAppointment", commonController.DecryptData, userController.deleAppointment);
router.get("/getUserDetails", userController.getUserDetails);

module.exports=router;