const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');
const Role = require('./role');

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

module.exports = User;
