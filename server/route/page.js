const HttpStatus = require('http-status-codes');
const express = require('express');
const router = express.Router();
const validator = require('../validator');
const createLogger = require('../logger');
const logger = createLogger('web-server.page-route');
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    if (!validator.newPage(req.body)) {
      logger.error('validation of create new page request failed', validator.newPage.errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.newPage.errors });
      return;
    }
    const page = await db.model.Page.createPage(req.body);
    res.json({
      page
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.put('/:page', async (req, res) => {
  try {
    if (!validator.editPage(req.body)) {
      logger.error('validation of create course request failed', validator.editPage.errors);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.editPage.errors });
      return;
    }
    const edited = await db.model.Page.editPage(req.body);
    res.json({
      page: edited
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    });
  }
});

router.delete('/:page', async (req, res) => {
  if (!validator.deletePage(req.params)) {
    logger.error('validation of delete page request failed', validator.deletePage.errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.deletePage.errors });
    return;
  }
  const deleted = await db.model.Page.delete(req.params.page);
  res.json({
    page: deleted
  });
});

router.get('/:page', async (req, res) => {
  const { deletePage: getPage } = validator;
  if (!getPage(req.params)) {
    logger.error('validation of get page request failed', getPage.errors);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: getPage.errors });
    return;
  }
  const page = await db.model.Page.delete(req.params.page);
  res.json({
    page
  });
});

module.exports = router;
