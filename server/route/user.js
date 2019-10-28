const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const createLogger = require('../logger');
const validator = require('../validator');
const db = require('../db');

const router = express.Router();
const SECRET = config.get('web-app:secret');
const logger = createLogger('web-server.user-route');

/**
 * @swagger
 * definitions:
 *   UserCredentials:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *
 * /user/login:
 *   post:
 *     description: Login to the application
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/UserCredentials'
 *     responses:
 *       200:
 *         description: login
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).end();
  }
  const valid = await db.model.User.verify(username, password);
  if (valid) {
    logger.info(
      'user',
      username,
      'authenticated successfully, creating tokens'
    );
    const token = jwt.sign({ username }, SECRET, {
      expiresIn: config.get('web-app:token-expires-in')
    });
    const refreshToken = jwt.sign({ username }, SECRET, {
      expiresIn: config.get('web-app:refresh-token-expires-in')
    });
    return res.json({ token, refreshToken });
  }
  return res.status(401).end();
});

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
 *       password:
 *         type: string
 *         format: password
 *       email:
 *         type: string
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       roles:
 *         type: array
 *         items:
 *           type: string
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
    res
      .status(409)
      .json({ errors: [{ dataPath: '.username', message: 'already exists' }] });
    return;
  }

  const user = await db.model.User.create(data);
  logger.info('user', user.username, 'has been created, id', String(user._id));
  res.json({ username: user.user, _id: user._id });
});

module.exports = router;
