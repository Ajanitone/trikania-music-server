

import multer from "multer";
import path from "path";
import cloudinaryV2 from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudinary = cloudinaryV2.v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "trikania-music",
    format: async (req, file) => {
      const extension = path.extname(file.originalname);
      return extension;
    },
    public_id: (req, file) => `${req.user._id}-profileImage`,
  },
});

export default multer({ storage });