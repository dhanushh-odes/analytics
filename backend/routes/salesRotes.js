import express from "express";
import {
    createSale,
    getAllSales,
    deleteSale,getSaleById
} from "../controller/salesController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createSale);

router.get("/view", authMiddleware, getAllSales);

router.delete("/delete/:sale_id", authMiddleware, deleteSale);
router.get("/view/:sale_id", authMiddleware, getSaleById);

export default router;