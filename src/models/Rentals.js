import mongoose from 'mongoose';
import User from './User.js';  // Add this import

const RentalSchema = new mongoose.Schema({
    rental_id: Number,
    tenant_username: String,
    start_date: Date,
    rent_amount: Number,
    status: String,
    owner_username: String, 
});

RentalSchema.statics.createNewRental = async function(rentalData) {
    const newRental = new this({
        rental_id: Date.now(),
        tenant_username: rentalData.tenant_username,
        start_date: new Date(),
        rent_amount: rentalData.rent_amount,
        status: 'active',
        owner_username: rentalData.owner_username
    });
    await newRental.save();  // Remove the return here
    
    const updatedUser = await User.findOne({ username: rentalData.tenant_username });
    
    return {
        rental: newRental,
        user: updatedUser
    };
};

const Rentals = mongoose.model('Rentals', RentalSchema);

export default Rentals;