/**
 * https://www.oauth.com/oauth2-servers/access-tokens/password-grant/
 *
 * */
const HttpStatus = require('http-status-codes');
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
 *         enum: [password, refresh_token]
 *         description: login - password, refresh_token on refresh
 *         example: password
 *       client_id:
 *         type: string
 *         description: sent client id, for instance "WEB-APP",
 *         example: WEB-APP
 *       username:
 *         type: string
 *         description: required when grant_type="password"
 *         example: admin
 *       password:
 *         type: string
 *         format: password
 *         description: required when grant_type="password"
 *         example: masterpassword
 *       refresh_token:
 *         type: string
 *         description: required when grant_type="refresh_token"
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyIiwicm9sZXMiOlsiYWRtaW4tcm9sZS0yIl0sInBlcm1pc3Npb25zIjpbInN1cGVyLXBlcm1pc3Npb24iXSwicmVmcmVzaFRva2VuIjoxLCJpYXQiOjE1NzI2NjgxOTAsImV4cCI6MTU3Mjc1NDU5MH0.5cYO9-10sGAyKhUjSM0sDxnP-IYUByWhAdMkQ6rn6A8
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
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: validator.tokenRequest.errors });
    return;
  }

  const grantType = data.grant_type;

  let user;
  if (grantType === GRANT_TYPE.PASSWORD) {
    logger.info('grant type: password');
    const { username, password } = req.body;
    user = await db.model.User.verify(username, password);
    if (!user) {
      logger.error('username/password are wrong');
      return res.status(HttpStatus.UNAUTHORIZED).end();
    }
    await user.updateLoginStats();
    logger.info('user', user.email, 'authenticated successfully, creating tokens');
  } else if (grantType === GRANT_TYPE.REFRESH_TOKEN) {
    logger.info('grant type: refresh token');
    try {
      const userData = jwt.verify(req.body.refresh_token, SECRET);
      if (userData.refreshToken !== 1) {
        logger.error('wrong token used to refresh!');
        return res.status(HttpStatus.UNAUTHORIZED).end();
      }
      user = await db.model.User.verifyEmail(userData.email);
      if (!user) {
        logger.error('user permissions revoked');
        return res.status(HttpStatus.UNAUTHORIZED).end();
      }
    } catch (e) {
      logger.error('refresh token is wrong');
      return res.status(HttpStatus.UNAUTHORIZED).end();
    }
    logger.info('refresh token for user', user.email, 'verified successfully, refreshing access_token');
  }

  const userData = {
    username: user.username,
    email: user.email,
    roles: await user.roleNames,
    permissions: await user.permissionNames
  };
  const token = jwt.sign(userData, SECRET, {
    expiresIn: config.get('web-app:token-expires-in')
  });

  let refreshToken;
  if (grantType === GRANT_TYPE.REFRESH_TOKEN) {
    refreshToken = req.body.refresh_token;
  } else if (grantType === GRANT_TYPE.PASSWORD) {
    userData.refreshToken = 1;
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
