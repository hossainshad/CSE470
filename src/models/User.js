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
  tenant_flat_id: { type: Number, default: null },
});

const User = mongoose.model('User', UserSchema);

export default User;
