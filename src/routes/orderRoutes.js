import express from "express";

import {
  createOrder,
  list,
  findOne,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js"; //Call the productController
const router = express.Router();

router.post("/add", createOrder);
router.get("/list", list);

router.get("/findone/:id", findOne);

router.put("/edit/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);

export default router;
