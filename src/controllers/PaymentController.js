import PaymentModel from '../models/PaymentModel.js';

class PaymentController {
    static async processPayment(req, res) {
        const { rentalId, amount } = req.body;
        try {
            const payment = await PaymentModel.createPayment({
                rental_id: rentalId,
                amount: parseFloat(amount),
                payment_month: new Date().getMonth() + 1,
                payment_year: new Date().getFullYear(),
                paid_date: new Date()
            });
            res.send({ message: 'Payment successful!', paymentId: payment.insertedId });
        } catch (err) {
            res.status(500).send({ message: 'Error processing payment' });
        }
    }
}

export default PaymentController;
