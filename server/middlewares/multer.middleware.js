
import multer from "multer";

const storage = multer.memoryStorage();

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const upload = multer({
    storage,

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG and WEBP images are allowed"));
        }
    }
});

export default upload;
