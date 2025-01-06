import mongoose from 'mongoose';
import User from './User.js'; 

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
    await newRental.save();  
    
    const updatedUser = await User.findOne({ username: rentalData.tenant_username });
    
    return {
        rental: newRental,
        user: updatedUser
    };
};
RentalSchema.statics.getOwnerTenants = async function(owner_username) {
    return await this.find({ owner_username });
};
RentalSchema.statics.getTenantRental = async function(tenant_username) {
    return await this.findOne({ tenant_username });
};
RentalSchema.statics.getPaymentStatus = async function(rental, payments) {
    const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
    return {
        tenant_username: rental.tenant_username,
        rent_amount: rental.rent_amount,
        totalPaid,
        remainingAmount: rental.rent_amount - totalPaid,
        status: totalPaid >= rental.rent_amount ? 'Paid' : 'Unpaid'
    };
};


const Rentals = mongoose.model('Rentals', RentalSchema);

export default Rentals;