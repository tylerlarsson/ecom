const express = require('express');
const createLogger = require('../logger');
const validator = require('../validator');
const db = require('../db');

const router = express.Router();
const logger = createLogger('web-server.permission-route');

/**
 * @swagger
 * definitions:
 *   Permission:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       description:
 *         type: string
 *
 * /permission:
 *   post:
 *     description: updates or creates a new permission
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: permission
 *         description: New Permission object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Permission'
 *     responses:
 *       200:
 *         description: created a new permission in DB
 *       422:
 *         description: model does not satisfy the expected schema
 *       409:
 *         description: permission with this name already exists
 *
 */
router.post('/', async (req, res) => {
  const data = req.body;
  if (!validator.newPermission(data)) {
    logger.error('validation of the new permission failed', validator.newPermission.errors);
    res.status(422).json({ errors: validator.newPermission.errors });
    return;
  }

  if (!data.id) {
    // new permission flow - check the name
    const existing = await db.model.Permission.findOne({ name: data.name });
    if (existing) {
      logger.error('permission', data.name, 'already exists');
      res.status(409).json({ errors: [{ dataPath: '.name', message: 'already exists' }] });
      return;
    }
  }

  const permission = await db.model.Permission.create(data);
  logger.info('permission', permission.name, 'has been created/updated, id', String(permission._id));
  res.json(permission);
});

module.exports = router;
