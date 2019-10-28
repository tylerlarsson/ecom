const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');

mongoose.Promise = Promise;
mongoose.connect(config.get('db:url'), { useNewUrlParser: true });

const USER = new mongoose.Schema({
  username: { type: String, unique: true },
  hash: String,
  email: { type: String, index: true },
  firstname: { type: String, index: true },
  lastname: { type: String, index: true },
  roles: { type: [String], index: true }
});

USER.statics.create = async ({
  username,
  password,
  email,
  firstname,
  lastname,
  roles
}) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = new User({ username, hash, email, firstname, lastname, roles });
  await user.save();
  return user;
};

USER.statics.verify = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    return false;
  }
  return bcrypt.compare(password, user.hash);
};

const User = mongoose.model('user', USER);

module.exports = {
  model: {
    User
  }
};
