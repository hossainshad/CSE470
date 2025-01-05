import mongoose from "mongoose";
import Property from "./Properties.js";
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
    async getVacantFlats(propertyIds) {
        return await Flat.find({
            property_id: { $in: propertyIds },
            status: 'vacant'
        });
    },
    async getFlatsForProperty(propertyId) {
        return await Flat.find({ property_id: propertyId });
    },
    
    async addFlat(flatData) {
        const newFlat = new Flat(flatData);
        await Property.findOneAndUpdate(
            { p_id: flatData.property_id },
            { $inc: { total_flats: 1 } },
            { new: true }
        );
        return await newFlat.save();
    }
};

export default Flat;