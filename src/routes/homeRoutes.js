import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { PropertyModel } from '../models/Properties.js';
import { FlatModel } from '../models/Flats.js';

const router = express.Router();

const homepage = async (req, res) => {
    try {
        const user = req.session.user;
        const properties = await PropertyModel.getAllPropertiesExcludingOwner(user.username);
        const propertyIds = properties.map(p => p.p_id);
        const flats = await FlatModel.getVacantFlats(propertyIds);
        const flatsToShow = flats.map(flat => {
            const property = properties.find(p => p.p_id === flat.property_id);
            return {
                ...flat._doc,
                property_name: property.property_name,
                location_area: property.location_area,
                address: property.address
            };
        });

        res.render('homepage', { user, flats: flatsToShow });

    } catch (error) {
        console.error('Error:', error);
        res.render('homepage', { 
            user, 
            flats: [], 
            error: 'Unable to load properties' 
        });
    }
};

router.get('/homepage', requireAuth, homepage);

export default router;