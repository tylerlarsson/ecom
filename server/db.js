/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const bcrypt = require('bcryptjs');
const config = require('./config');

mongoose.Promise = Promise;
mongoose.connect(config.get('db:url'), { useNewUrlParser: true });

/* eslint-disable no-param-reassign */
const DEFAULT_OPTIONS = {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
};
/* eslint-enable no-param-reassign */

const USER = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    hash: String,
    email: { type: String, index: true },
    firstname: { type: String, index: true },
    lastname: { type: String, index: true },
    roles: [{ type: [ObjectId], ref: 'role' }]
  },
  DEFAULT_OPTIONS
);

// eslint-disable-next-line func-names
USER.virtual('roleNames').get(async function() {
  const roles = await Role.find({ _id: { $in: this.roles } }).select({ name: 1 });
  return roles.map(({ name }) => name);
});

// eslint-disable-next-line func-names
USER.virtual('permissionNames').get(async function() {
  const roles = await Role.find({ _id: { $in: this.roles } })
    .populate('permissions')
    .select({ permissions: 1 });
  const r = new Set();
  // eslint-disable-next-line no-return-assign
  roles.forEach(({ permissions }) => permissions.forEach(({ name }) => r.add(name)));
  return Array.from(r);
});

USER.statics.create = async ({ username, password, email, firstname, lastname, roles }) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = new User({ username, hash, email, firstname, lastname, roles });
  await user.save();
  return user;
};

USER.statics.verifyUsername = async username => {
  const user = await User.findOne({ username });
  if (!user) {
    return false;
  }
  return user;
};

USER.statics.verify = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    return false;
  }
  if (await bcrypt.compare(password, user.hash)) {
    return user;
  }
  return false;
};

const User = mongoose.model('user', USER);

const ROLE = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: String,
    permissions: [{ type: [ObjectId], ref: 'permission' }]
  },
  DEFAULT_OPTIONS
);

ROLE.statics.createIfNotExists = async (name, permissions) => {
  const role = await Role.findOne({ name });
  if (role) {
    role.permissions = permissions;
    return role.save();
  }
  return Role.create({ name, description: '', permissions });
};

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

ROLE.statics.findNotCreatedRoles = async roles => {
  const select = await Role.find({ _id: { $in: roles } }).select({ _id: 1 });
  const created = select.map(({ _id }) => String(_id));
  return roles.filter(p => !created.includes(p));
};

const Role = mongoose.model('role', ROLE);

const PERMISSION = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: String
  },
  DEFAULT_OPTIONS
);

PERMISSION.statics.createIfNotExists = async name => {
  const permission = await Permission.findOne({ name });
  if (permission) {
    return permission;
  }
  return Permission.create({ name, description: '' });
};

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
  const select = await Permission.find({ _id: { $in: permissions } }).select({ _id: 1 });
  const created = select.map(({ _id }) => String(_id));
  return permissions.filter(p => !created.includes(p));
};

const Permission = mongoose.model('permission', PERMISSION);

module.exports = {
  model: {
    User,
    Role,
    Permission
  }
};
