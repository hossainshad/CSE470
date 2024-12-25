import express from 'express';
import PaymentController from '../controllers/PaymentController.js'; // Adjust the path based on your folder structure

const router = express.Router();

// Route to show the payment page
router.get('/payment', (req, res) => {
    res.render('payment'); // Render the payment page
});

// Route to handle the payment submission
router.post('/processPayment', PaymentController.processPayment); // Handle payment processing

export default router;
