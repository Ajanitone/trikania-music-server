import multer from "multer";
import path from "path";
import cloudinaryV2 from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique IDs


dotenv.config();

const cloudinary = cloudinaryV2.v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "trikania-music",
//     format: async (req, file) => {
//       // Extract format (without dot) from file MIME type
//       return path.extname(file.originalname).slice(1); // "jpg", "png", etc.
//     },
//     public_id: (req, file) => {
//       const uniqueSuffix = uuidv4(); // Generate a UUID for uniqueness
//       return `${req.user._id}-musicImage-${uniqueSuffix}`;
//     },
//   },
// });

// export default multer({ storage });


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Determine folder and public_id based on route path
    const isUserProfileRoute = req.originalUrl.includes("/profile");
    const folder = isUserProfileRoute ? "trikania-users" : "trikania-music";
    const uniqueSuffix = uuidv4();

    return {
      folder,
      format: path.extname(file.originalname).slice(1), // "jpg", "png", etc.
      public_id: isUserProfileRoute
        ? `${req.params.userId}-profileImage-${uniqueSuffix}`
        : `${req.body.productId}-musicImage-${uniqueSuffix}`,
    };
  },
});

export default multer({ storage });

