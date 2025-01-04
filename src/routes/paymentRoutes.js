import express from 'express';
import { paymentPage, handlePayment } from '../controllers/PaymentController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/payment', paymentPage);
router.post('/payment', requireAuth, handlePayment);

export default router;