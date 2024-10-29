const { validator } = require("../validate");
const commonfun = require("./utils/usercommon");

async function validateusersignup(req, res, next) {
  let rules = {
    email: ["required", "email", "unique_email", "regex:/^[a-zA-Z0-9.]+@[a-z]+.[a-z]+$/"],
    fullName: ["required", "regex:/^[a-zA-Z]+[ ]+[A-Za-z]{5,20}$/"],
    password: ["required", "regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/"],
    type:["required","regex:/^[a-zA-Z ]+$/"]
  };
  await validator(req.body, rules, async (errors) => {
    if (errors) {
      console.log("Error :", errors);
      return commonfun.sendError(req, res, errors, 422);
    } else {
      next();
    }
  });
};
async function validateuserLogin(req, res, next) {
  let rules = {
    email: ["required", "email", "regex:/^[a-zA-Z0-9.]+@[a-z]+.[a-z]+$/"],
    password: ["required"],
  };
  await validator(req.body, rules, async (errors) => {
    if (errors) {
      console.log("Error :", errors);
      return commonfun.sendError(req, res, errors, 422);
    } else {
      next();
    }
  });
};
async function validateDoctorProfile(req, res, next) {
  let rules = {
    about: ["required", "regex:/^[a-zA-Z0-9 ]{10,100}$/"],
    qualification: ["required", "regex:/^[a-zA-Z ]{5,25}$/"],
    expertise: ["required"],
    startShiftTime: ["required", "regex:/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/"],
    endShiftTime: ["required", "regex:/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/"],
    image:["required","regex:/^[a-zA-Z0-9. ]+$/"]
  };
  await validator(req.body, rules, async (errors) => {
    if (errors) {
      console.log("Error :", errors);
      return commonfun.sendError(req, res, errors, 422);
    } else {
      next();
    }
  });
};
async function validateUserProfile(req, res, next) {
  let rules = {
    contactNumber: ["required", "regex:/^[0-9]{10}$/","unique_contactNumber"],
    address: ["required","regex:/^[a-zA-Z0-9- ]+$/"],
    image:["required","regex:/^[a-zA-Z0-9. ]+$/"]
  };
  await validator(req.body, rules, async (errors) => {
    if (errors) {
      console.log("Error :", errors);
      return commonfun.sendError(req, res, errors, 422);
    } else {
      next();
    }
  });
};
async function validateDoctorupdate(req, res, next) {
  let rules = {
    about: ["regex:/^[a-zA-Z0-9 ]{10,50}$/"],
    experience: ["regex:/^[a-zA-Z ]{5,25}$/"],
    startShiftTime: ["regex:^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"],
    endShiftTime: ["regex:^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"],
    fullName: ["regex:/^[a-zA-Z]+[ ]+[A-Za-z]{5,25}$/"],
    email: ["email","unique_email", "regex:/^[a-zA-Z0-9.]+@[a-z]+.[a-z]+$/"],
  };
  await validator(req.body, rules, async (errors) => {
    if (errors) {
      console.log("Error :", errors);
      return commonfun.sendError(req, res, errors, 422);
    } else {
      next();
    }
  });
};
async function validateUserupdate(req, res, next) {
  let rules = {
    email: ["email", "unique_email", "regex:/^[a-zA-Z0-9.]+@[a-z]+.[a-z]+$/"],
    fullName: ["regex:/^[a-zA-Z ]+$/"],
    contactNumber: ["regex:/^[0-9]{10}$/","unique_contactNumber"],
    address: ["regex:/^[a-zA-Z0-9 ,._-]+$/"],
    fullName: [ "regex:/^[a-zA-Z]+[ ]+[A-Za-z]+$/"],
  };
  await validator(req.body, rules, async (errors) => {
    if (errors) {
      console.log("Error :", errors);
      return commonfun.sendError(req, res, errors, 422);
    } else {
      next();
    }
  });
};
async function validateAddAppointment(req, res, next) {
  let rules = {
    reason: ["required", "regex:/^[a-zA-Z ]{5,30}$/"],
    date: ["required"],
  };
  await validator(req.body, rules, async (errors) => {
    if (errors) {
      console.log("Error :", errors);
      return commonfun.sendError(req, res, errors, 422);
    } else {
      next();
    }
  });
};
async function validateConfirmAppointment(req, res, next) {
  let rules = {
    appointmentId: ["required"],
    response: ["required"]

  };
  await validator(req.body, rules, async (errors) => {
    if (errors) {
      console.log("Error :", errors);
      return commonfun.sendError(req, res, errors, 422);
    } else {
      next();
    }
  });
};
module.exports = { validateusersignup, validateUserProfile,validateAddAppointment,validateuserLogin, validateDoctorProfile, validateConfirmAppointment, validateDoctorupdate, validateUserupdate };
