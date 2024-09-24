const { validator } = require("../validate");
const commonfun = require("./utils/usercommon");

async function validateusersignup(req, res, next) {
  let rules = {
    email: ["required", "email", "unique_email", "regex:/^[a-zA-Z0-9.]+@[a-z]+.[a-z]+$/"],
    fullName: ["required", "regex:/^[a-zA-Z ]+$/"],
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
    reason: ["required", "regex:/^[a-zA-Z ]+$/"],
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
module.exports = { validateusersignup, validateAddAppointment };
