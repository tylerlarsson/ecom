const db = require('../db');

module.exports = {
  label: 'Has role',
  async filter(name) {
    const id = await db.model.Role.mapOneToId(name);
    return { roles: id || null };
  }
};
