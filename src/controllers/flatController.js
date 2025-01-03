import { FlatModel } from '../models/Flats.js';

export const addFlat = async (req, res) => {
    try {
        const imagePaths = req.files?.map(file => `/uploads/flats/${file.filename}`) || [];
        const flatData = {
            property_id: req.params.p_id,
            ...req.body,
            images: imagePaths
        };
        await FlatModel.addFlat(flatData);
        res.redirect(`/owner/property/${req.params.p_id}`);
    } catch (error) {
        res.status(500).redirect(`/owner/property/${req.params.p_id}`);
    }
};