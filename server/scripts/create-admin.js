const config = require('../config');
const db = require('../db');
const { readJson } = require('../core/file-util');

const { data: rolesData = {} } = readJson('server', 'scripts', 'test-data', 'roles.json');

const ADMIN = 'admin';
const ADMIN_PASSWORD = 'masterpassword';
const ADMIN_EMAIL = 'admin@admin.admin';

(async () => {
  try {
    const defaultAdminPermissions = config.get('default-admin-permissions');
    const permissions = await Promise.all(defaultAdminPermissions.map(dp => db.model.Permission.createIfNotExists(dp)));
    const role = await db.model.Role.createIfNotExists(
      ADMIN,
      permissions.map(({ _id }) => _id),
      null,
      rolesData[ADMIN] && rolesData[ADMIN].description
    );

    const data = {
      username: ADMIN,
      password: ADMIN_PASSWORD,
      email: ADMIN_EMAIL,
      firstname: 'admin',
      lastname: 'admin',
      roles: [role]
    };

    let user = await db.model.User.findOne({ username: ADMIN });
    if (user) {
      Object.assign(user, data);
      await user.save();
      // eslint-disable-next-line no-console
      console.log('admin user has been updated, user id', user._id);
    } else {
      user = await db.model.User.create(data);
      // eslint-disable-next-line no-console
      console.log('admin user has been created, user id', user._id);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
