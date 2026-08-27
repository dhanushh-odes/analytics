import express from 'express';
import {createCategory,getAllCategories,deleteCategory,updateCategory} from '../controller/CategoryOfProductsController.js';
const router = express.Router();

router.post('/create', createCategory);
router.get('/view', getAllCategories);
router.delete('/delete/:cat_id', deleteCategory);
router.put('/update/:cat_id', updateCategory);
export default router;
