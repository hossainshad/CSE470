export const manageProperty = async (req, res) => {
    const user = req.session.user;
    const propertyId = req.params.p_id;

    try {
        const property = await Property.findOne({ p_id: propertyId, owner_username: user.username });
        if (!property) {
            return res.status(404).send('Property not found');
        }

        const flats = await FlatModel.getFlatsForProperty(propertyId);

        res.render('propertyManage', {
            user: user,
            property: property,
            flats: flats
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};