const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

function generateHash(filename) {
    return crypto.createHash('md5').update(filename).digest("hex");
}

function createUploadMiddleware(destinationFolder) {
    
    const storageConfig = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationFolder);
        },
        filename: (req, file, cb) => {
            const hash = generateHash(file.originalname);
            cb(null, hash + path.extname(file.originalname));
        }
    });
    const fileFilterConfig = (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images are allowed."), false);
        }
    };
    return multer({
        storage: storageConfig,
        limits: {
            fileSize: 1000000000
        },
        fileFilter: fileFilterConfig
    });
}
module.exports = {
    uploadDoctorDegree: createUploadMiddleware("uploads/degree"),
    uploadUserImage: createUploadMiddleware("uploads/userProfile")
};