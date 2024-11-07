import express from "express";

import {
  createNewsletter,
  list,
  findOne,
  updateNewsletter,
  deleteNewsletter,
} from "../controllers/newsletterController.js"; //Call the productController
const router = express.Router();

router.post("/addnews", createNewsletter);
router.get("/list", list);

router.get("/findone/:id", findOne);

router.put("/edit/:id", updateNewsletter);
router.delete("/delete/:id", deleteNewsletter);

export default router;
