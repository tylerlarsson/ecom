const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const expressJwt = require('express-jwt');
const swaggerSpec = require('./swagger');
// const jwt = require('jsonwebtoken');
const userRoute = require('./route/user');
const config = require('./config');

const SECRET = config.get('web-app:secret');

const createLogger = require('./logger');
const logger = createLogger('web-server');

const app = express();
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/user', userRoute);

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
app.get('/', expressJwt({ secret: SECRET }), (req, res) => {
  res.send('Hello World');
});

const port = config.get('web-app:port');
app.listen(port, () => logger.info('web server started port', port));
