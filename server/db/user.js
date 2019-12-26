const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const bcrypt = require('bcryptjs');
const { DEFAULT_OPTIONS } = require('./common');
const Role = require('./role');
const Enrollment = require('./enrollment');
const { error404 } = require('../core/util');
const { sendMail } = require('../core/mail');

const USER = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    hash: String,
    email: { type: String, unique: true },
    firstname: { type: String, index: true },
    lastname: { type: String, index: true },
    roles: [{ type: String, ref: 'role' }],
    notes: [{ type: ObjectId, ref: 'internal-comment' }],
    enrolledIn: [{ type: ObjectId, ref: 'enrollment' }],
    loginCount: { type: Number, default: 0 },
    loginLast: { type: Date, default: null },
    created: { type: Date, default: null },
    deleted: { type: Boolean, default: false },
    visitorKey: { type: String, index: true },
    deletedAt: Date
  },
  {
    toJSON: {
      transform(doc, ret) {
        DEFAULT_OPTIONS.toJSON.transform(doc, ret);
        delete ret.hash;
      }
    }
  }
);

// eslint-disable-next-line func-names
USER.virtual('roleNames').get(async function() {
  return this.roles;
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

USER.statics.create = async ({
  username,
  password,
  email,
  firstname,
  lastname,
  roles,
  created,
  loginLast,
  loginCount
}) => {
  if (!username) {
    username = email;
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  created = created || new Date();
  const user = new User({ username, hash, email, firstname, lastname, roles, created, loginLast, loginCount });
  await user.save();
  return user;
};

USER.statics.update = async args => {
  const { id, ...rest } = args;
  const user = await User.findById(id);
  if (!user) {
    throw error404({ user }, id);
  }
  Object.assign(user, { ...rest });
  return user.save();
};

USER.statics.delete = async id => {
  const user = await User.findById(id);
  if (!user) {
    throw error404({ user }, id);
  }
  user.deleted = true;
  user.deletedAt = new Date();
  return user.save();
};

USER.statics.resetPasswordRequest = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw error404({ user }, email, 'email');
  }
  const link = `https://example.com/reset?bjson=${user.id}`;
  const subject = 'Password recovery';
  const template = 'forgot-password';
  const from = `EcomFreedom Support <support@ecomfreedom.com>`;

  const data = { link };

  const message = await sendMail({
    to: email,
    from,
    subject,
    template,
    data
  });
  return {
    success: !!message.messageId
  };
};

USER.statics.resetPassword = async args => {
  const { id, newPassword } = args;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  const user = await User.findById(id);
  if (!user) {
    throw error404({ user }, id);
  }
  user.hash = hash;
  await user.save();
  return user.toJSON();
};

USER.statics.verifyUsername = async username => {
  const user = await User.findOne({ username });
  if (!user) {
    return false;
  }
  return user;
};

USER.statics.verifyEmails = async emails => {
  const count = await User.countDocuments({ email: { $in: emails } });
  return count === emails.length;
};

USER.statics.verifyEmail = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  return user;
};

USER.statics.verify = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  if (await bcrypt.compare(password, user.hash)) {
    return user;
  }
  return false;
};

// eslint-disable-next-line func-names
USER.methods.updateLoginStats = async function() {
  this.loginLast = new Date();
  ++this.loginCount;
  await this.save();
};

USER.statics.mapToId = async users => {
  const probableIds = users.filter(r => mongoose.Types.ObjectId.isValid(r));
  const select = await User.find({
    $or: [{ _id: { $in: probableIds } }, { username: { $in: users } }, { email: { $in: users } }]
  }).select({ _id: 1 });
  return select.map(({ _id }) => String(_id));
};

USER.methods.addNote = async function addNote(note) {
  this.notes.push(note);
  return this.save();
};

USER.methods.deleteNote = async function deleteNote(note) {
  const idx = this.notes.findIndex(r => r.toString() === note.toString());
  if (idx === -1) throw error404({ Note: null }, note);
  this.notes.splice(idx, 1);
  return this.save();
};

USER.methods.addEnrollment = async function addEnrollment(enrollment) {
  const _enrollment = await Enrollment.findById(enrollment);
  if (!_enrollment) {
    throw error404({ enrollment }, enrollment);
  } else {
    const idx = this.enrolledIn.findIndex(i => i.toString() === enrollment);
    if (idx !== -1) {
      const error = new Error(`User ${this._id} already enrolled in ${enrollment}.`);
      error.status = 400;
      throw error;
    }
    this.enrolledIn.push(enrollment);
    return this.save();
  }
};

USER.methods.discardEnrollment = async function discardEnrollment(enrollment) {
  const _enrollment = await Enrollment.findById(enrollment);
  if (!_enrollment) {
    throw error404({ enrollment }, enrollment);
  } else {
    const idx = this.enrolledIn.findIndex(i => i.toString() === enrollment);
    if (idx === -1) {
      const error = new Error(`User is not enrolled in ${enrollment}`);
      error.status = 404;
      throw error;
    }
    this.enrolledIn.splice(idx, 1);
    return this.save();
  }
};

USER.methods.addRole = async function addRole(roleName) {
  if (!this.roles) {
    this.roles = [];
  }
  const role = await Role.findById(roleName);
  if (!role) throw error404({ role }, roleName);

  this.roles.push(roleName);
  return this.save();
};

USER.methods.deleteRole = async function deleteRole(roleName) {
  const idx = this.roles.findIndex(r => r === roleName);
  if (idx === -1) {
    throw error404({ role: null }, roleName);
  }
  this.roles.splice(idx, 1);
  return this.save();
};

const User = mongoose.model('user', USER);

module.exports = User;
