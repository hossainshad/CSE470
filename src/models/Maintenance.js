import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
    tenant_username: {
        type: String,
        required: true
    },
    owner_username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined', 'Ongoing', 'Completed'],
        default: 'Pending'
    },
    
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
