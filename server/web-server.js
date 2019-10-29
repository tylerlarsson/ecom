const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { Role, Permission } = require('./authorizer');

const userRoute = require('./route/user');
const roleRoute = require('./route/role');
const permissionRoute = require('./route/permission');

const config = require('./config');

const createLogger = require('./logger');
const logger = createLogger('web-server');

const app = express();
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/user', userRoute);
app.use('/role', roleRoute);
app.use('/permission', permissionRoute);

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
app.get('/', (req, res) => {
  res.send('Public Hello World');
});

/**
 * @swagger
 *
 * /test/admin:
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

app.get('/test/admin', Role('admin-role'), (req, res) => {
  res.send('admin role only!');
});

/**
 * @swagger
 *
 * /test/permission3:
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

app.get('/test/permission3', Permission('third-super-permission'), (req, res) => {
  res.send('third-super-permission only!');
});

const port = config.get('web-app:port');
app.listen(port, () => logger.info('web server started port', port));
