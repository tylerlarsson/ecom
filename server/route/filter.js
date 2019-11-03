const express = require('express');
const filter = require('../filter');
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

module.exports = router;
