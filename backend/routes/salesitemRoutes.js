import express from "express";

import {
    getSaleItemsBySaleId,
    addSaleItem,
    updateSaleItemQuantity,
    deleteSaleItem,
} from "../controller/saleitemController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/view/:sale_id", authMiddleware, getSaleItemsBySaleId);

router.post("/create/:sale_id", authMiddleware, addSaleItem);

router.put(
    "/update/:sale_item_id",
    authMiddleware,
    updateSaleItemQuantity
);

router.delete(
    "/delete/:sale_item_id",
    authMiddleware,
    deleteSaleItem
);

export default router;