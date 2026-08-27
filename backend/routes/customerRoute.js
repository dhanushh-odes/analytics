import express from "express";
import { createCustomer, getAllCustomers, deleteCustomer ,updateCustomer} from "../controller/CustomerController.js";
const router = express.Router();

router.post('/create', createCustomer);
router.get('/view', getAllCustomers);
router.delete('/delete/:customer_id', deleteCustomer);
router.put('/update/:customer_id', updateCustomer);
export default router;
