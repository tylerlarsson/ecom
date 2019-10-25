const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const swaggerDefinition = {
  basePath: '/', // Base path (optional)
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};
const options = {
  swaggerDefinition,
  apis: ['./server/web-server.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const createLogger = require('./logger');
const logger = createLogger('web-server');
const config = require('./config');

const app = express();
app.use(bodyParser.json());

const SECRET = config.get('web-app:secret');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 *
 * /:
 *   get:
 *     description: returns a hello
 *     security:
 *      - bearerAuth: []
 *     produces:
 *       - application/text
 *     responses:
 *       200:
 *         description: login
 */
app.get('/', expressJwt({ secret: SECRET }), function(req, res) {
  res.send('Hello World');
});

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
 * /login:
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
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).end();
  }
  if (username === 'test' && password === 'pass') {
    logger.info(
      'user',
      username,
      'authenticated successfully, creating tokens',
    );
    const token = jwt.sign({ username }, SECRET, {
      expiresIn: config.get('web-app:token-expires-in'),
    });
    const refreshToken = jwt.sign({ username }, SECRET, {
      expiresIn: config.get('web-app:refresh-token-expires-in'),
    });
    return res.json({ token, refreshToken });
  }
  return res.status(401).end();
});

const port = config.get('web-app:port');
app.listen(port, () => logger.info('web server started port', port));
