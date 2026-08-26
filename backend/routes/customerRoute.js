import express from "express";
import { createCustomer, getAllCustomers, deleteCustomer } from "../controller/CustomerController.js";
const router = express.Router();

router.post('/create', createCustomer);
router.get('/view', getAllCustomers);
router.delete('/delete/:customer_id', deleteCustomer);
export default router;
