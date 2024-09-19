const { EncryptData } = require("./encryption");
const decryptData = require("./decryption");

const sendSuccess = async (req, res, data) => {
  if (req.headers.env && req.headers.env === "test") {
    res.status(200).json(data);
  } else {
    const responseData = await EncryptData(req, res, data);
    res.status(200).json(responseData);
  }
};
const sendError = async (req, res, errors,status) => {
  res.status(status).send(errors).json();
};
module.exports = { sendError, sendSuccess };
