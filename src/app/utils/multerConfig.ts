import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { SECRET } from "../config/env";


// MULTER CONFIG
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "/uploads"))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
export const upload = multer({ storage: storage });


// UPLOAD TO CLOUDINARY
export const uploadToCloudinary = async (file: Express.Multer.File) => {
    // CONFIGURATION
    cloudinary.config({
        cloud_name: SECRET.CLOUDINARY_CLOUD_NAME,
        api_key: SECRET.CLOUDINARY_API_KEY,
        api_secret: SECRET.CLOUDINARY_API_SECRET
    });

    // UPLOAD AN IMAGE
    const uploadResult = await cloudinary.uploader
        .upload(
            file.path, {
            public_id: file.filename,
        }
        )
        .catch((error) => {
            console.log(error);
        });

    return uploadResult;
};