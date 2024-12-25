import express from "express";
import OwnerController from '../controllers/OwnerController.js';
//import PaymentController from '../controllers/PaymentController.js';

const router = express.Router();

// Route to display owner information (with flatId set to 1)
router.get('/owner/1', OwnerController.showOwnerInfo);

// Route to process payment
//router.post('/payment', PaymentController.processPayment);

export default router;
