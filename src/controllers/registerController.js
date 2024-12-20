// controllers/registerController.js
import User from '../models/User.js';

export const getRegisterPage = (req, res) => {
  res.render('register', { error: null });
};

export const registerUser = async (req, res) => {
  try {
  
    await User.registerNewUser(req.body);
    
    res.redirect('/login');
  } catch (err) {
  
    res.render('register', { error: err.message });
  }
};