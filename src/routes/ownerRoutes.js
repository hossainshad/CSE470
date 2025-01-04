import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import RentalRequest from '../models/RentalRequest.js';
import User from '../models/User.js';
import Flat from '../models/Flats.js';

const router = express.Router();

// Get rental requests
const getRentalRequests = async (req, res) => {
    try {
        const ownerUsername = req.session.user.username;
        const requests = await RentalRequest.getOwnerRequests(ownerUsername);
        const requestDetails = await Promise.all(requests.map(async (request) => {
            const requester = await User.findOne({ username: request.requester_username });
            const flat = await Flat.findById(request.flat_id);
            
            return {
                request_id: request.request_id,
                flat_number: flat.flat_number,
                requester_name: requester.name,
                requester_phone: requester.phone,
                requester_email: requester.email,
                request_date: request.request_date
            };
        }));

        res.json(requestDetails);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
};


const rejectRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        await RentalRequest.rejectRequest(requestId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to reject request' });
    }
};

router.get('/rental-requests', requireAuth, getRentalRequests);
router.post('/reject-request/:requestId', requireAuth, rejectRequest);

export default router;