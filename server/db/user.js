const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { DEFAULT_OPTIONS } = require('./common');
const Role = require('./role');

mongoose.Promise = Promise;

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
  try {
    const roles = await Role.find({ _id: { $in: this.roles } }).select({ name: 1 });
    return roles.map(({ name }) => name);
  } catch (error) {
    console.error(error);
  }
});

// eslint-disable-next-line func-names
USER.virtual('permissionNames').get(async function() {
  try {
    const roles = await Role.find({ _id: { $in: this.roles } })
      .populate('permissions')
      .select({ permissions: 1 });
    const r = new Set();
    // eslint-disable-next-line no-return-assign
    roles.forEach(({ permissions }) => permissions.forEach(({ name }) => r.add(name)));
    return Array.from(r);
  } catch (error) {
    console.error(error);
  }
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
  try {
    console.log('grips here');
    const user = await User.find({});
    console.log(user);
    if (!user) {
      return false;
    }
    if (await bcrypt.compare(password, user.hash)) {
      return user;
    }
    return false;
  } catch (error) {
    console.error(error);
  }
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
