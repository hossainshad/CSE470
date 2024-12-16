import User from "../models/User.js";

export const loginPage = (req, res) => {
    res.render("login", { error: null }); // Ensure 'error' is passed even if null
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(400).render("login", { error: "Username not found" });
        }
        
        if (user.pass !== password) { 
            return res.status(400).render("login", { error: "Invalid password" });
        }
      
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.status(500).render("login", { error: "Server error" });
    }
};
