import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";

import multerMiddleware from "../config/multer-cloudinary.js";

import {
  addProduct,
  listProduct,
  deleteProduct,
  findone,
  editProduct,
  searchProduct1,
} from "../controllers/productController.js"; //Call the productController



router.post("/addProduct", auth, multerMiddleware.single("image"), addProduct);
router.get("/listProduct", listProduct);

router.delete("/deleteProduct/:_id", deleteProduct);

router.post("/edit", multerMiddleware.single("image"), editProduct);
router.get("/findone", findone);

router.get("/searchProduct/:name", searchProduct1);

export default router;
