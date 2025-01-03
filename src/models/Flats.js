// models/Flats.js
import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
    property_id: { type: Number, required: true },
    flat_number: { type: String, required: true },
    size: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    rent: { type: Number, required: true },
    status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
    tenant_id: { type: String, default: null },
    images: [{ type: String }]
});

const Flat = mongoose.model("Flat", flatSchema);

export const FlatModel = {
    async getFlatsForProperty(propertyId) {
        return await Flat.find({ property_id: propertyId });
    },
    
    async addFlat(flatData) {
        const newFlat = new Flat(flatData);
        return await newFlat.save();
    }
};

export default Flat;