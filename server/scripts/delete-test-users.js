const db = require('../db');

const TEST_USER_ROLE = 'test-user';

(async function f() {
  try {
    const roleId = await db.model.Role.mapOneToId(TEST_USER_ROLE);
    const { deletedCount } = await db.model.User.deleteMany({ roles: roleId });
    // eslint-disable-next-line no-console
    console.log(deletedCount, 'records removed');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
