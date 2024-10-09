const Validator = require("validatorjs");
const User = require("./components/schema/user");
const Doctor = require("./components/schema/doctor");
const validator = async (body, rules, callback) => {
  const validation = new Validator(body, rules);
  Validator.registerAsync(
    "unique_email",
    async (email, attribute, req, passes) => {
      try {
        const user = await User.findOne({ email, $nor: [{ status: 2 }] });
        const doctor = await Doctor.findOne({ email, $nor: [{ status: 2 }] });
        if (!user && !doctor) {
          passes();
        } else {
          passes(false, "Email has already been taken.");
        }
      } catch (error) {
        passes(false, "Error checking email availability.");
      }
    }
  );
  Validator.registerAsync(
    "unique_contactNumber",
    async (contactNumber, attribute, req, passes) => {
      try {
        const user = await User.findOne({ contactNumber: contactNumber, $nor: [{ status: 2 }] });
        if (!user) {
          passes();
        } else {
          passes(false, "phoneNumber has already been taken.");
        }
      } catch (error) {
        passes(false, "Error checking phoneNumber availability.");
      }
    }
  );
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(convert(validation), false));
};

function convert(errors) {
  var tmp = errors.errors.all();
  var obj = {};
  for (let key in tmp) {
    obj[key] = tmp[key].join(",");
  }
  return obj;
}
module.exports = { validator };
