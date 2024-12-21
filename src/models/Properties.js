// models/Properties.js
import mongoose from "mongoose";
import User from "./User.js"; 

const propertySchema = new mongoose.Schema({
    p_id: { type: Number, required: true },
    owner_username: { type: String, required: true },
    property_name: { type: String, required: true },
    location_area: { type: String, required: true },
    address: { type: String, required: true },
    lift_status: { type: Boolean, required: true },
    total_flats: { type: Number, required: true, default: 0 }
});

const Property = mongoose.model("Property", propertySchema);

export const PropertyModel = {
    async addProperty(propertyData) {
        try {
         const updatedUser=  await User.findOneAndUpdate(
                { username: propertyData.owner_username },
                { o_flag: true },
                { new: true } );
            const newProperty = new Property({
                p_id: Date.now(),
                owner_username: propertyData.owner_username,
                property_name: propertyData.property_name,
                location_area: propertyData.location_area,
                address: propertyData.address,
                lift_status: propertyData.lift_status === 'on' ? true : false,
            });
            
            await newProperty.save();
            return updatedUser;
        } catch (error) {
            throw new Error(`Error adding property: ${error.message}`);
        }
    },
    
    async getAllProperties() {
        return await Property.find({});
    },
    
    async getPropertyByOwner(username) {
        return await Property.find({ owner_username: username });
    },

    
    async getPropertyById(propertyId, ownerUsername) {
        return await Property.findOne({ 
            p_id: propertyId, 
            owner_username: ownerUsername 
        });
    }
};

export default Property;