const mongoose = require('mongoose');
const { DEFAULT_OPTIONS } = require('./common');

const ROLE = new mongoose.Schema(
  {
    _id: String,
    name: { type: String, unique: true },
    description: String,
    permissions: [{ type: String, ref: 'permission' }],
    filters: [String]
  },
  { ...DEFAULT_OPTIONS, _id: false }
);

// used from DB seed
/* istanbul ignore next */
ROLE.statics.createIfNotExists = async (name, permissions, filters, description = '') => {
  const role = await Role.findOne({ name });
  if (role) {
    if (permissions) {
      role.permissions = permissions;
    }
    if (filters) {
      role.filters = filters;
    }
    return role.save();
  }
  return Role.create({ name, description, permissions, filters });
};

ROLE.statics.create = async ({ name, description, permissions, filters }) => {
  let role = await Role.findOne({ name });
  if (role) {
    role._id = name;
    role.name = name;
    role.description = description;
    if (permissions) {
      role.permissions = permissions;
    }
  } else {
    permissions = permissions || [];
    filters = filters || [];
    role = new Role({ _id: name, name, description, permissions, filters });
  }
  return role.save();
};

ROLE.statics.mapToId = async roles => {
  const select = await Role.find({ $or: [{ _id: { $in: roles } }, { name: { $in: roles } }] }).select({ _id: 1 });
  return select.map(({ _id }) => String(_id));
};

ROLE.statics.mapOneToId = async role => {
  const [id] = await Role.mapToId([role]);
  return id;
};

ROLE.statics.isCreated = async roles => {
  const created = await Role.mapToId(roles);
  return roles.length === created.length;
};

const Role = mongoose.model('role', ROLE);

module.exports = Role;
