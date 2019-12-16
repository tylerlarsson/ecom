const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { DEFAULT_OPTIONS } = require('./common');
const Role = require('./role');
const { sendMail } = require('../mail');

const USER = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    hash: String,
    email: { type: String, unique: true },
    firstname: { type: String, index: true },
    lastname: { type: String, index: true },
    roles: [{ type: String, ref: 'role' }],
    loginCount: { type: Number, default: 0 },
    loginLast: { type: Date, default: null },
    created: { type: Date, default: null }
  },
  {
    toJSON: {
      transform(doc, ret) {
        console.log(doc, ret);
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

USER.statics.resetPasswordRequest = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error(`User with email ${email} is not found.`);
    error.status = 404;
    throw error;
  }
  const link = `https://example.com/reset?bjson=${user.id}`;
  const message = await sendMail({
    from: 'EcomFreedom Support <support@ecomfreedom.com>',
    to: email,
    subject: 'Password recovery',
    html: `Click <b><a href="${link}" target="_blank">here</a></b>`
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
    const error = new Error(`User with id ${id} is not found.`);
    error.status = 404;
    throw error;
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

const User = mongoose.model('user', USER);

module.exports = User;
