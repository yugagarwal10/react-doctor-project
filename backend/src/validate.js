const Validator = require("validatorjs");
const User=require("./components/schema/user");
const validator = async (body, rules, callback) => {
  const validation = new Validator(body, rules);
  Validator.registerAsync(
    "unique_email",
    async (email, attribute, req, passes) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          passes();
        } else {
          passes(false, "Email has already been taken.");
        }
      } catch (error) {
        passes(false, "Error checking email availability.");
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
