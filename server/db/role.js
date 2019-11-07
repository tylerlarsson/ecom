const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');

const ROLE = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: String,
    permissions: [{ type: ObjectId, ref: 'permission' }],
    filters: [String]
  },
  DEFAULT_OPTIONS
);

ROLE.statics.createIfNotExists = async (name, permissions, filters) => {
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
  return Role.create({ name, description: '', permissions, filters });
};

ROLE.statics.create = async ({ id, name, description, permissions, filters }) => {
  let role;
  if (id) {
    role = await Role.findById(id);
    role.name = name;
    role.description = description;
    if (permissions) {
      role.permissions = permissions;
    }
    if (filters) {
      role.filters = filters;
    }
  } else {
    permissions = permissions || [];
    filters = filters || [];
    role = new Role({ name, description, permissions, filters });
  }
  return role.save();
};

ROLE.statics.mapToId = async roles => {
  const probableIds = roles.filter(r => mongoose.Types.ObjectId.isValid(r));
  const select = await Role.find({ $or: [{ _id: { $in: probableIds } }, { name: { $in: roles } }] }).select({ _id: 1 });
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
