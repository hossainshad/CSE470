import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    p_id: { type: Number, required: true },
    owner_username: { type: String, required: true },
    property_name: { type: String, required: true },
    location_area: { type: String, required: true },
    address: { type: String, required: true },
    lift_status: { type: Boolean, required: true },
    total_flats: { type: Number, required: true },
});

const Property = mongoose.model("Property", propertySchema);

export default Property;