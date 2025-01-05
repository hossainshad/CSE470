import mongoose from 'mongoose';

const RentalSchema = new mongoose.Schema({
    rental_id: Number,
    tenant_username: String,
    start_date: Date,
    rent_amount: Number,
    status: String,
    owner_username: String, // Ensure this field exists in the schema
});

const Rentals = mongoose.model('Rentals', RentalSchema);
export default Rentals;
