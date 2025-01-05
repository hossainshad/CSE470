import { PropertyModel } from "../models/Properties.js";
import { FlatModel } from "../models/Flats.js";
import Rentals from "../models/Rentals.js";
import User from "../models/User.js";

// Controller for showing owner information
export const showOwnerInfo = async (req, res) => {
    try {
        const username = req.session.user?.username;

        if (!username) {
            return res.render("dashboard", {
                user: req.session.user,
                ownerInfo: null,
                properties: [],
                message: "User not logged in!"
            });
        }

        const rental = await Rentals.findOne({ tenant_username: username });

        if (!rental) {
            let properties = [];
            if (req.session.user.o_flag) {
                properties = await PropertyModel.getPropertyByOwner(username);
            }
            return res.render("dashboard", {
                user: req.session.user,
                ownerInfo: null,
                properties,
                message: "No rental information found"
            });
        }

        const ownerUsername = rental.owner_username;

        if (!ownerUsername) {
            return res.render("dashboard", {
                user: req.session.user,
                ownerInfo: null,
                properties: [],
                message: "No owner information available"
            });
        }

        const ownerInfo = await User.findOne({ username: ownerUsername });

        if (!ownerInfo) {
            return res.render("dashboard", {
                user: req.session.user,
                ownerInfo: null,
                properties: [],
                message: "Owner information not found"
            });
        }

        let properties = [];
        if (req.session.user.o_flag) {
            properties = await PropertyModel.getPropertyByOwner(username);
        }

        res.render("dashboard", {
            user: req.session.user,
            ownerInfo,
            properties,
            message: null
        });
    } catch (err) {
        console.error("Error retrieving owner information:", err);
        res.render("dashboard", {
            user: req.session.user,
            ownerInfo: null,
            properties: [],
            message: "Error retrieving owner information"
        });
    }
};

// Controller for rendering the dashboard
export const dashboard = async (req, res) => {
    const user = req.session.user;

    try {
        let properties = [];
        if (user.o_flag) {
            properties = await PropertyModel.getPropertyByOwner(user.username);
        }

        const rental = await Rentals.findOne({ tenant_username: user.username });
        const ownerInfo = rental
            ? await User.findOne({ username: rental.owner_username })
            : null;

        res.render("dashboard", {
            user,
            properties,
            ownerInfo,
            message: null
        });
    } catch (err) {
        console.error(err);
        res.render("dashboard", {
            user,
            properties: [],
            ownerInfo: null,
            message: "Error loading dashboard"
        });
    }
};
export const getTenantDetails = async (req, res) => {
    try {
        const flatId = req.params.flatId;
        const tenant = await User.getTenantDetails(flatId);
        
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const tenantInfo = {
            name: tenant.name,
            email: tenant.email,
            phone: tenant.phone
        };

        res.json({ tenant: tenantInfo });
    } catch (error) {
        console.error('Error fetching tenant details:', error);
        res.status(500).json({ error: 'Error fetching tenant details' });
    }
};
export const manageProperty = async (req, res) => {
    const user = req.session.user;
    const propertyId = req.params.p_id;

    try {
        const property = await PropertyModel.getPropertyById(propertyId, user.username);

        if (!property) {
            return res.render("propertyManage", {
                user,
                property: null,
                flats: [],
                message: "Property not found"
            });
        }

        const flats = await FlatModel.getFlatsForProperty(propertyId);

        res.render("propertyManage", {
            user,
            property,
            flats,
            message: null
        });
    } catch (err) {
        console.error(err);
        res.render("propertyManage", {
            user,
            property: null,
            flats: [],
            message: "Error loading property"
        });
    }
};
