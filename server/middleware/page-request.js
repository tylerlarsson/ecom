const validator = require('../validator');

module.exports = async (req, res, next) => {
  const { pageNumber, pageSize, ...fields } = req.query;

  if (!validator.pageRequest({ pageNumber, pageSize })) {
    res.status(422).json({ errors: validator.pageRequest.errors });
    return;
  }

  req.query = fields;
  const n = Number(pageNumber);
  const s = Number(pageSize);
  req.page = { limit: s, skip: s * n };

  next();
};
