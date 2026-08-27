import express from "express";
import {createProduct,getAllproducts,deleteProduct,updateProduct} from "../controller/productController.js";

const router = express.Router();
router.post('/create', createProduct);
router.get('/products',getAllproducts);
router.put('/update/:product_id', updateProduct);   
router.delete('/delete/:product_id', deleteProduct);
export default router;


