import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    payment_id: Number,
    rental_id: Number,
    amount: Number,
    payment_month: Number,
    payment_year: Number,
    paid_date: Date,
    owner_username: String, 
    tenant_username: String, 
});

export default mongoose.model('Payments', paymentSchema);
