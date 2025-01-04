import mongoose from 'mongoose';

const rentalRequestSchema = new mongoose.Schema({
    request_id: { type: Number, required: true },
    flat_id: { type: String, required: true },
    requester_username: { type: String, required: true },
    owner_username: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    request_date: { type: Date, default: Date.now }
});
rentalRequestSchema.statics.getOwnerRequests = async function(ownerUsername) {
    return await this.find({ owner_username: ownerUsername, status: 'pending' });
};

rentalRequestSchema.statics.rejectRequest = async function(requestId) {
    return await this.findOneAndDelete({ request_id: requestId });
};
rentalRequestSchema.statics.createRequest = async function(requestData) {
    const newRequest = new this({
        request_id: Date.now(),
        flat_id: requestData.flat_id,
        requester_username: requestData.requester_username,
        owner_username: requestData.owner_username,
        status: 'pending'
    });
    return await newRequest.save();
};

rentalRequestSchema.statics.getRequestsByOwner = async function(ownerUsername) {
    return await this.find({ owner_username: ownerUsername });
};

const RentalRequest = mongoose.model('RentalRequest', rentalRequestSchema);
export default RentalRequest;