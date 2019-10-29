const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
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

USER.statics.create = async ({ username, password, email, firstname, lastname, roles }) => {
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

const ROLE = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  permissions: { type: [ObjectId], index: true }
});

ROLE.statics.create = async ({ id, name, description, permissions }) => {
  let role;
  if (id) {
    role = await Role.findById(id);
    role.name = name;
    role.description = description;
    role.permissions = permissions;
  } else {
    role = new Role({ name, description, permissions });
  }
  return role.save();
};

const Role = mongoose.model('role', ROLE);

const PERMISSION = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String
});

PERMISSION.statics.create = async ({ id, name, description }) => {
  let permission;
  if (id) {
    permission = await Permission.findById(id);
    permission.name = name;
    permission.description = description;
  } else {
    permission = new Permission({ name, description });
  }
  return permission.save();
};

PERMISSION.statics.findNotCreatedPermissions = async permissions => {
  const notCreated = await Permission.find({ _id: { $not: { $in: permissions } } }).select({ _id: 1 });
  if (notCreated.length) {
    return notCreated.map(({ _id }) => _id);
  }
  return [];
};

const Permission = mongoose.model('permission', PERMISSION);

module.exports = {
  model: {
    User,
    Role,
    Permission
  }
};
