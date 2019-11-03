const filter = require('../filter');
const validator = require('../validator');

module.exports = async (req, res, next) => {
  const paramNames = Object.keys(req.query);

  if (!validator.filters(req.query)) {
    res.status(422).json({ errors: validator.filters.errors });
    return;
  }

  const filtersInQuery = filter.findFilters(paramNames);
  if (filtersInQuery.length) {
    const conditions = filtersInQuery.map(f => f.filter(req.query[f.name])).filter(f => !!f);
    req.filter = { $and: conditions };
  } else {
    req.filter = {};
  }

  return next();
};
