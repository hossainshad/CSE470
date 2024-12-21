import { PropertyModel } from "../models/Properties.js";

export const addNewProperty = async (req, res) => {
    try {
        
        const propertyData = {
            owner_username: req.session.user.username, // Changed from username to owner_username
            property_name: req.body.property_name,
            location_area: req.body.location_area,
            address: req.body.address,
            lift_status: req.body.lift_status
        };

        
        await PropertyModel.addProperty(propertyData);
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Failed to add property' });
    }
};