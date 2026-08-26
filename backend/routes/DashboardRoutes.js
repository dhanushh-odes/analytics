import express from "express";
import { totalCategories,totalProducts,totalCustomers, totalSales,topSellingProducts,salesByCategory,topCustomers,recentSales,monthlySales} from "../controller/DashboardController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/total-categories", authMiddleware, totalCategories);
router.get("/total-products", authMiddleware, totalProducts);
router.get("/total-customers", authMiddleware, totalCustomers);
router.get("/total-sales", authMiddleware, totalSales);
router.get("/top-selling-products", authMiddleware, topSellingProducts);
router.get("/sales-by-category", authMiddleware, salesByCategory);
router.get("/top-customers", authMiddleware, topCustomers);
router.get("/recent-sales", authMiddleware, recentSales);
router.get("/monthly-sales", authMiddleware, monthlySales);

export default router;
