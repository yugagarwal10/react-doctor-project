const express = require("express");
const crypto = require("crypto")
const app = express();
const cors = require("cors");
const config = require("config");
const public = config.get("public");
const private = config.get("private");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/doctor");
const userRoute = require("./routes/userRoute");
const doctorRoute = require("./routes/doctorRoute");
const commonRoute = require("./routes/commonroutes");
console.log("server connected");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cors({
  origin: "http://localhost:3000"
}))
app.use("/user", userRoute)
app.use("/doctor", doctorRoute);
app.use(commonRoute)
app.listen(5000, () => {
  console.log("app is running on port 5000");
})

const key = crypto
  .createHash('sha512')
  .update(public)
  .digest('hex')
  .substring(0, 32);

const iv = crypto
  .createHash('sha512')
  .update(private)
  .digest('hex')
  .substring(0, 16);

const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
const message = "hello world";
let encryptedData = cipher.update(message, "utf-8", "base64");
encryptedData += cipher.final("base64");
console.log(encryptedData);

const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)
let decrypted = decipher.update(encryptedData, "base64", "utf-8")
decrypted += decipher.final('utf8')
console.log(decrypted);