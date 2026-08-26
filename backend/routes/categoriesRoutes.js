import express from 'express';
import {createCategory,getAllCategories,deleteCategory} from '../controller/CategoryOfProductsController.js';
const router = express.Router();

router.post('/create', createCategory);
router.get('/view', getAllCategories);
router.delete('/delete/:cat_id', deleteCategory);
export default router;
