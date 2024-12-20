import OwnerModel from '../models/OwnerModel.js';

class OwnerController {
    static async showOwnerInfo(req, res) {
        try {
            // Call the getOwnerInfo method with the username 'owner_user1'
            const ownerInfo = await OwnerModel.getOwnerInfo('owner_user1');
            
            if (!ownerInfo) {
                return res.status(404).send({ message: 'Owner not found!' });
            }

            // Render the view with the owner information
            res.render('tenant/ownerInfo', { ownerInfo });
        } catch (err) {
            // Handle error
            res.status(500).send({ message: 'Error retrieving owner information' });
        }
    }
}

export default OwnerController;
