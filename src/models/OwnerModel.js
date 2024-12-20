import mongoose from 'mongoose';
import User from './User.js'; // Assuming you have a model for Users

class OwnerModel {
    static async getOwnerInfo(username = 'owner_user1') {
        try {
            console.log(`Searching for username: ${username}`);
            const owner = await User.findOne({ username: username });

            if (!owner) {
                console.log(`No owner found for username: ${username}`);
                throw new Error('Owner not found');
            }

            console.log('Owner Information:', owner);
            return {
                name: owner.name,
                email: owner.email,
                phone: owner.phone,
                address: owner.address,
                username: owner.username,
            };
        } catch (err) {
            console.error('Error fetching owner info:', err.message);
            throw err;
        }
    }
}

export default OwnerModel;
