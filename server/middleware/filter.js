const HttpStatus = require('http-status-codes');
const filter = require('../filter');
const validator = require('../validator');

module.exports = async (req, res, next) => {
  const paramNames = Object.keys(req.query);

  if (!validator.filters(req.query)) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.filters.errors });
    return;
  }

  const filtersInQuery = filter.findFilters(paramNames);
  if (filtersInQuery.length) {
    const promises = filtersInQuery.map(f => f.filter(req.query[f.name]));
    const conditions = (await Promise.all(promises)).filter(f => !!f);
    req.filter = { $and: conditions };
  } else {
    req.filter = {};
  }

  return next();
};
