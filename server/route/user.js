const express = require('express');
// const jwt = require('jsonwebtoken');
// const config = require('../config');
const createLogger = require('../logger');
const validator = require('../validator');
const db = require('../db');

const router = express.Router();
// const SECRET = config.get('web-app:secret');
const logger = createLogger('web-server.user-route');

/**
 * @swagger
 * definitions:
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *       - email
 *       - firstname
 *       - lastname
 *     properties:
 *       username:
 *         type: string
 *         example: super
 *       password:
 *         type: string
 *         format: password
 *         example: awesomepassword
 *       email:
 *         type: string
 *         example: super@awesome.com
 *       firstname:
 *         type: string
 *         example: John
 *       lastname:
 *         type: string
 *         example: Doe
 *       roles:
 *         type: array
 *         items:
 *           type: string
 *           description: id or name of role
 *           example: admin
 *
 * /user:
 *   post:
 *     description: Login to the application
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: New User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     responses:
 *       200:
 *         description: creates a new user in DB
 *       422:
 *         description: model does not satisfy the expected schema
 *       409:
 *         description: user with this username already exists
 *
 */
router.post('/', async (req, res) => {
  const data = req.body;

  if (!validator.newUser(data)) {
    logger.error('validation of the new user failed', validator.newUser.errors);
    res.status(422).json({ errors: validator.newUser.errors });
    return;
  }

  const existing = await db.model.User.findOne({ username: data.username });
  if (existing) {
    logger.error('user', data.username, 'already exists');
    res.status(409).json({ errors: [{ dataPath: '.username', message: 'already exists' }] });
    return;
  }

  const notCreatedRoles = await db.model.Role.findNotCreatedRoles(data.roles);
  if (notCreatedRoles.length) {
    logger.error('roles', notCreatedRoles, 'have not been created yet');
    res.status(409).json({ errors: [{ dataPath: '.roles', message: `not created, ids: ${notCreatedRoles}` }] });
    return;
  }

  data.roles = await db.model.Role.mapToId(data.roles);
  const user = await db.model.User.create(data);
  logger.info('user', user.username, 'has been created, id', String(user._id));
  res.json({ username: user.user, _id: user._id });
});

module.exports = router;
