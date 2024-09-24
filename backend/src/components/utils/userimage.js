const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

function generateHash(filename) {
  return crypto.createHash("md5").update(filename).digest("hex");
}

const storageConfig = multer.diskStorage({
  destination:"uploads/userProfile",
  filename: (req, file, cb) => {
    const hash = generateHash(file.originalname);
    cb(null, hash + path.extname(file.originalname));
  },
});
const fileFilterConfig = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
      cb(null, true);
  } else {
      cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};
const Upload = multer({
  storage: storageConfig,
  limits: {
    fileSize:1000000000 
},
fileFilter: fileFilterConfig
}).single("image");

module.exports = { Upload };
