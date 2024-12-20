import mongoose from 'mongoose';

class PaymentModel {
    static async createPayment(paymentData) {
        // Assuming you have already established a mongoose connection and 'payments' collection is set up
        const db = mongoose.connection.db;
        return db.collection('payments').insertOne(paymentData);
    }
}

export default PaymentModel;
