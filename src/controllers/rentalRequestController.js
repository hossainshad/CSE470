import RentalRequest from '../models/RentalRequest.js';
import Rentals from '../models/Rentals.js';
import Flat from '../models/Flats.js';
import User from "../models/User.js"
export const acceptRentalRequest = async (req, res) => {
    try {
        const requestId = parseInt(req.params.requestId);
        const request = await RentalRequest.getRequestWithDetails(requestId);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        const flat = await Flat.getFlatDetails(request.flat_id);
        if (!flat) {
            return res.status(404).json({ error: 'Flat not found' });
        }

        const rentalData = {
            tenant_username: request.requester_username,
            rent_amount: flat.rent,
            owner_username: request.owner_username
        };

      
        await Rentals.createNewRental(rentalData);

        await Flat.updateFlatStatus(request.flat_id, request.requester_username);

        await User.updateTenantStatus(request.requester_username, request.flat_id);

        await RentalRequest.acceptRequest(requestId);

        res.json({ 
            success: true,
            message: 'Request accepted successfully'
           
        });
    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).json({ error: 'Failed to accept request' });
    }
};
