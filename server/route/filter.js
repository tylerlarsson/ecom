const express = require('express');
const filter = require('../core/filter');
const config = require('../core/config');
const API = config.get('base-path');

module.exports = app => {
  const router = express.Router();
  /**
   * @swagger
   *
   * /filter:
   *   get:
   *     description: returns all the filters
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: created a new role in DB
   *
   */
  router.get('/', (req, res) => {
    res.json(filter.filters);
  });

  app.use(`${API}/filter`, router);
};
