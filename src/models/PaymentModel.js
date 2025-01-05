import mongoose from 'mongoose';

class PaymentModel {
    static async createPayment(paymentData) {
        const db = mongoose.connection.db;
        return db.collection('payments').insertOne(paymentData);
    }
}

export default PaymentModel;
