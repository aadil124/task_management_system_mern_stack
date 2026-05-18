import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "task-manager-avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "jfif"],
    transformation: [
      {
        width: 300,
        height: 300,
        crop: "fill",
      },
    ],
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

// IMPORTANT
export { cloudinary };
