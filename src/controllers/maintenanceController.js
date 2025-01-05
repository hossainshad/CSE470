import Maintenance from "../models/Maintenance.js"; // Maintenance model
import Rentals from "../models/Rentals.js"; // Rentals model

// Controller to fetch maintenance requests
export const getMaintenanceRequests = async (req, res) => {
    try {
        const user = req.session.user; // Ensure user is from session

        // Check if user is authenticated
        if (!user) {
            return res.status(400).send('User not authenticated');
        }

        let maintenanceRequests = [];

        // Fetch maintenance requests based on the user's role (owner/tenant)
        if (user.o_flag) {
            // Owner: Fetch maintenance requests directed to the owner
            maintenanceRequests = await Maintenance.find({ owner_username: user.username });
        } else if (user.t_flag) {
            // Tenant: Fetch maintenance requests created by the tenant
            maintenanceRequests = await Maintenance.find({ tenant_username: user.username });
        }

        // Render the page with the maintenance requests
        res.render('maintenanceRequestsPage', { 
            user, 
            maintenanceRequests 
        });
    } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        res.status(500).send('Server error');
    }
};
// Controller for submitting a maintenance request

export const submitMaintenanceRequest = async (req, res) => {
    try {
        const user = req.session.user; 
        const { description } = req.body; 

       
        if (!user || !user.t_flag) {
            return res.status(400).send('Tenant not authenticated');
        }

        
        if (!description) {
            return res.status(400).send('Description is required');
        }

        
        const rental = await Rentals.findOne({ tenant_username: user.username });

        if (!rental) {
            return res.status(404).send('Rental not found for this tenant');
        }

        const ownerUsername = rental.owner_username; 

        
        const newRequest = new Maintenance({
            tenant_username: user.username,
            description, 
            owner_username: ownerUsername, 
            status: 'Pending' 
        });

        await newRequest.save();

        res.redirect('/maintenance-requests');
    } catch (error) {
        console.error('Error submitting maintenance request:', error);
        res.status(500).send('Error submitting request');
    }
};


// Controller for approving a maintenance request

export const approveMaintenanceRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const user = req.session.user; 

        const maintenanceRequest = await Maintenance.findById(requestId);

        if (!maintenanceRequest) {
            return res.status(404).send('Maintenance request not found');
        }

       
        if (maintenanceRequest.owner_username !== user.username) {
            return res.status(403).send('You are not authorized to approve this request');
        }

        
        maintenanceRequest.status = 'Approved';
        await maintenanceRequest.save();

        res.redirect('/maintenance-requests'); 
    } catch (error) {
        console.error('Error approving maintenance request:', error);
        res.status(500).send('Server error');
    }
};

// Controller for declining a maintenance request
export const declineMaintenanceRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const user = req.session.user; 

        const maintenanceRequest = await Maintenance.findById(requestId);

        if (!maintenanceRequest) {
            return res.status(404).send('Maintenance request not found');
        }

        
        if (maintenanceRequest.owner_username !== user.username) {
            return res.status(403).send('You are not authorized to decline this request');
        }

       
        maintenanceRequest.status = 'Declined';
        await maintenanceRequest.save();

        res.redirect('/maintenance-requests'); // Redirect to the maintenance requests page
    } catch (error) {
        console.error('Error declining maintenance request:', error);
        res.status(500).send('Server error');
    }
};




// Controller for marking maintenance as completed
export const markMaintenanceCompleted = async (req, res) => {
    try {
        const { requestId } = req.params;
        const user = req.session.user; // Assuming user is from session

        const maintenanceRequest = await Maintenance.findById(requestId);

        if (!maintenanceRequest) {
            return res.status(404).send('Maintenance request not found');
        }


        if (maintenanceRequest.tenant_username !== user.username) {
            return res.status(403).send('You are not authorized to mark this request as completed');
        }

    
        maintenanceRequest.status = 'Completed';
        await maintenanceRequest.save();

        res.redirect('/maintenance-requests'); // Redirect to the maintenance requests page
    } catch (error) {
        console.error('Error marking maintenance as completed:', error);
        res.status(500).send('Server error');
    }
};
