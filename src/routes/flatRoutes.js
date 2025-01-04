import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import Property from '../models/Properties.js';
import Flat from '../models/Flats.js';
import User from '../models/User.js';
import RentalRequest from '../models/RentalRequest.js';

const router = express.Router();

// View flat details
const viewFlatDetails = async (req, res) => {
    try {
        const flatId = req.params.id;
        
        // Get flat details
        const flat = await Flat.findById(flatId);
        if (!flat) {
            return res.render('error', { message: 'Flat not found' });
        }

        // Get property details
        const property = await Property.findOne({ p_id: flat.property_id });
        if (!property) {
            return res.render('error', { message: 'Property not found' });
        }

        // Get owner details
        const owner = await User.findOne({ username: property.owner_username });
        if (!owner) {
            return res.render('error', { message: 'Owner not found' });
        }

        res.render('flatDetails', {
            flat,
            property,
            owner: {
                name: owner.name,
                email: owner.email,
                phone: owner.phone,
                username: owner.username
            },
            user: req.session.user
        });

    } catch (error) {
        console.error('Error:', error);
        res.render('error', { message: 'Error loading flat details' });
    }
};

// Handle rent request
const submitRentRequest = async (req, res) => {
    try {
        const { flatId, ownerUsername } = req.body;
        const requesterUsername = req.session.user.username;

        // Create rental request
        await RentalRequest.createRequest({
            flat_id: flatId,
            requester_username: requesterUsername,
            owner_username: ownerUsername
        });

        res.redirect(`/flats/${flatId}?message=Request sent successfully`);

    } catch (error) {
        console.error('Error:', error);
        res.redirect(`/flats/${req.body.flatId}?error=Failed to send request`);
    }
};

// Routes
router.get('/:id', requireAuth, viewFlatDetails);
router.post('/:id/request', requireAuth, submitRentRequest);

export default router;