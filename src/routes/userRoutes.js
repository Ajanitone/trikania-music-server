import express from "express";
import {
  register,
  login,
  emailConfirm,
  forgotPass,
  changePass,
  logout,
  updateProfile,
  updateCover,
  deleteUser,
  getProfile,
  updateUsername,
  listWishlist,
  removeFromWishlist,
  addToWishlist,
  searchUser,
  listUser,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
// import upload from "../config/multer-cloudinary.js";
import multerMiddleware from "../config/multer-cloudinary.js";
const router = express.Router();
import isAdminMiddleware from "../middleware/isAdminMiddleware.js";

router.post("/register", register);
router.post("/login", login);

router.post("/emailconfirm", emailConfirm);
router.post("/forgotpass", forgotPass);

router.post("/changepassword", changePass);
router.get("/logout", logout);

router.put("/profile/:userId", auth, multerMiddleware.single("image"), updateProfile);
router.get("/profile/:id", auth, getProfile);
router.put("/cover", auth, updateCover);

router.delete("/delete/:_id",auth,  deleteUser); //delete user function

router.put("/updateusername", auth, updateUsername);
router.get("/list",auth,  listUser); //list function

router.get("/search/:username", auth, searchUser); //search function

router.post("/wishlist/add", auth, addToWishlist); //wishlist function

router.post("/wishlist/delete", removeFromWishlist); //delete function

router.get("/wishlist/list/:user", auth, listWishlist); //Listing the wishlist items

export default router;
