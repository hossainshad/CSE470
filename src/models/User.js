import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  o_flag: { type: Boolean, default: false },
  t_flag: { type: Boolean, default: false },
  tenant_flat_id: { type: String, default: null }
});

UserSchema.statics.registerNewUser = async function(userData) {
  const userExists = await this.findOne({ username: userData.username });
  if (userExists) {
    throw new Error('Username already exists');
  }
  const emailExists = await this.findOne({ email: userData.email });
  if (emailExists) {
    throw new Error('Email already exists');
  }

  const newUser = new this({
    username: userData.username,
    pass: userData.pass,
    email: userData.email,
    name: userData.name,
    phone: userData.phone,
    address: userData.address,
    o_flag: Boolean(userData.o_flag),
    t_flag: Boolean(userData.t_flag),
    tenant_flat_id: null,
  });

  await newUser.save();
  return newUser;
};
UserSchema.statics.getTenantDetails = async function(flatId) {
  return await this.findOne({ tenant_flat_id: flatId.toString() });
};


UserSchema.statics.loginUser = async function(username, password) {
  const user = await this.findOne({ username });
  
  if (!user) {
    throw new Error('Username not found');
  }
  
  if (user.pass !== password) {
    throw new Error('Invalid password');
  }
  return user;
};
UserSchema.statics.getUserById = async function (userId) {
  return await this.findById(userId);
};


UserSchema.statics.updateTenantStatus = async function(username, flatId) {
  const updatedUser = await this.findOneAndUpdate(
      { username: username },
      { 
          t_flag: true,
          tenant_flat_id: flatId.toString()
      },
      { new: true }
  );
  
  if (!updatedUser) {
      throw new Error('User not found');
  }
  
  return updatedUser;
};

const User = mongoose.model('User', UserSchema);

export default User;