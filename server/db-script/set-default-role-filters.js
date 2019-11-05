const config = require('../config');
const db = require('../db');
const roles = config.get('default-role-filters');

(async function script() {
  try {
    for (const [name, filters] of Object.entries(roles)) {
      const role = await db.model.Role.createIfNotExists(name, null, filters);
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
