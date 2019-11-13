const validator = require('../validator');

module.exports = DEFAULT_PAGE_SIZE => async (req, res, next) => {
  // eslint-disable-next-line prefer-const
  let { pageNumber, pageSize, ...fields } = req.query;
  pageNumber = pageNumber || '0';
  pageSize = pageSize || String(DEFAULT_PAGE_SIZE);

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
