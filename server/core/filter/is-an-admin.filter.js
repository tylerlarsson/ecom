const db = require('../../db');

module.exports = {
  label: 'Is an admin',
  type: 'boolean',
  order: 140,
  async filter() {
    const id = await db.model.Role.mapOneToId('admin');
    return { roles: id || null };
  }
};
