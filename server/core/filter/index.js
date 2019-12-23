const fs = require('fs');
const path = require('path');

const pattern = /\.filter\.js$/;
const filters = [];

fs.readdirSync(__dirname)
  .filter(file => pattern.test(file))
  .forEach(file => {
    // eslint-disable-next-line global-require
    const filter = require(path.join(__dirname, file));
    const name = file.replace(pattern, '');
    filters.push({
      name,
      ...filter
    });
  });

module.exports = {
  exist(names) {
    return names.every(n => filters.some(f => f.name === n));
  },
  findFilters(names) {
    return filters.filter(f => names.includes(f.name));
  },
  filters
};
