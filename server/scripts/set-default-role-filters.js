const config = require('../core/config');
const db = require('../db');
const { readJson } = require('../core/file-util');
const roles = config.get('default-role-filters');
const { data: rolesData = {} } = readJson('server', 'scripts', 'test-data', 'roles.json');

(async function script() {
  try {
    for (const [name, filters] of Object.entries(roles)) {
      const role = await db.model.Role.createIfNotExists(
        name,
        null,
        filters,
        rolesData[name] && rolesData[name].description
      );
      // eslint-disable-next-line no-console
      console.log('role', role.name, 'has been created/updated with filters', filters);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
