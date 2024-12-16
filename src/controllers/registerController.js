import User from '../models/User.js';

export const getRegisterPage = (req, res) => {
  res.render('register', { error: null });
};


export const registerUser = async (req, res) => {
  const { username, pass, email, name, phone, address, o_flag, t_flag, tenant_flat_id } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.render('register', { error: 'Username already exists' });

    }
    const emailExists = await User.findOne({email});
    if (emailExists){
        return res.render('register', {error : "Email already exists"});
    }

    const newUser = new User({
      username,
      pass,
      email,
      name,
      phone,
      address,
      o_flag: Boolean(o_flag),
      t_flag: Boolean(t_flag),
      tenant_flat_id: t_flag ? tenant_flat_id : null, // Add flat ID only if t_flag is true
    });

    await newUser.save();
    res.redirect('/login'); // Redirect to login after successful registration
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.render('register', { error: 'An error occurred. Please try again.' });
  }
};
