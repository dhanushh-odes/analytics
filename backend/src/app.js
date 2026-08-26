import express from "express";
import cors from "cors";
import  authRoutes from '../routes/authRoutes.js';
import cookieParser from "cookie-parser";
import {authMiddleware} from "../middleware/authMiddleware.js";
import categoriesRoutes from "../routes/categoriesRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import customerRoutes from "../routes/customerRoute.js";
import salesRoutes from "../routes/salesRotes.js";
import DashboardRoutes from "../routes/DashboardRoutes.js";
import salesitemRoutes from "../routes/salesitemRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use(authMiddleware);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/salesitems', salesitemRoutes);
app.use('/api/dashboard', DashboardRoutes);

export default app;