const config = require('../config');
const db = require('../db');

const USER = 'user';
const USER_PASSWORD = 'userpassword';
const USER_EMAIL = 'user@user.com';

(async () => {
  try {
    const defaultUserPermissions = config.get('default-user-permissions');
    const permissions = await Promise.all(defaultUserPermissions.map(dp => db.model.Permission.createIfNotExists(dp)));
    const role = await db.model.Role.createIfNotExists(USER, permissions.map(({ _id }) => _id));

    const data = {
      username: USER,
      password: USER_PASSWORD,
      email: USER_EMAIL,
      firstname: 'user',
      lastname: 'user',
      roles: [role]
    };

    let user = await db.model.User.findOne({ username: USER });
    if (user) {
      Object.assign(user, data);
      await user.save();
      // eslint-disable-next-line no-console
      console.log('regular user has been updated, user id', user._id);
    } else {
      user = await db.model.User.create(data);
      // eslint-disable-next-line no-console
      console.log('regular user has been created, user id', user._id);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
