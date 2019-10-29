/**
 * https://www.oauth.com/oauth2-servers/access-tokens/password-grant/
 *
 * */

const express = require('express');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const config = require('../config');
const createLogger = require('../logger');
const validator = require('../validator');
const db = require('../db');

const router = express.Router();
const SECRET = config.get('web-app:secret');
const logger = createLogger('web-server.oauth-route');

const GRANT_TYPE = {
  PASSWORD: 'password',
  REFRESH_TOKEN: 'refresh_token'
};

/**
 * @swagger
 * definitions:
 *   TokenRequest:
 *     type: object
 *     properties:
 *       grant_type:
 *         type: string
 *         description: we support only "password"
 *       client_id:
 *         type: string
 *         description: sent client id, for instance "WEB-APP"
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       refresh_token:
 *         type: string
 *
 * /oauth/token:
 *   post:
 *     description: Login to the application to get token
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization data
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/TokenRequest'
 *     responses:
 *       200:
 *         description: login
 */
router.post('/token', async (req, res) => {
  const data = req.body;

  if (!validator.tokenRequest(data)) {
    logger.error('validation of the token request failed', validator.tokenRequest.errors);
    res.status(422).json({ errors: validator.tokenRequest.errors });
    return;
  }

  const grantType = data.grant_type;

  let user;
  if (grantType === GRANT_TYPE.PASSWORD) {
    logger.info('grant type password');
    const { username, password } = req.body;
    user = await db.model.User.verify(username, password);
    if (!user) {
      logger.error('username/password are wrong');
      return res.status(401).end();
    }
    logger.info('user', user.username, 'authenticated successfully, creating tokens');
  } else if (grantType === GRANT_TYPE.REFRESH_TOKEN) {
    try {
      const userData = jwt.verify(req.body.refresh_token, SECRET);
      user = await db.model.User.verifyUsername(userData.username);
      if (!user) {
        logger.error('user permissions revoked');
        return res.status(401).end();
      }
    } catch (e) {
      logger.error('refresh token is wrong');
      return res.status(401).end();
    }
  }

  const userData = { username: user.username, roles: await user.roleNames, permissions: await user.permissionNames };
  const token = jwt.sign(userData, SECRET, {
    expiresIn: config.get('web-app:token-expires-in')
  });

  let refreshToken;
  if (grantType === GRANT_TYPE.REFRESH_TOKEN) {
    refreshToken = req.body.refresh_token;
  } else if (grantType === GRANT_TYPE.PASSWORD) {
    refreshToken = jwt.sign(userData, SECRET, { expiresIn: config.get('web-app:refresh-token-expires-in') });
  }

  return res.json({
    access_token: token,
    expires_in: ms(config.get('web-app:token-expires-in')) / 1000,
    token_type: 'bearer',
    refresh_token: refreshToken
  });
});

module.exports = router;
