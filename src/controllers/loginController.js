import User from "../models/User.js";

export const loginPage = (req, res) => {
    res.render("login", { error: null }); // Ensure 'error' is passed even if null
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.loginUser(username, password); 
        req.session.user = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            o_flag: user.o_flag,
            t_flag: user.t_flag,        
            tenant_flat_id: user.tenant_flat_id,
        };

        res.redirect("/homepage");
    } catch (err) {
        res.status(400).render("login", { error: err.message });
    }
};
