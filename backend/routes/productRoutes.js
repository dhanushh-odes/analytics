import express from "express";
import {createProduct,getAllproducts,deleteProduct} from "../controller/productController.js";

const router = express.Router();
router.post('/create', createProduct);
router.get('/products',getAllproducts);
router.delete('/delete/:product_id', deleteProduct);
export default router;


