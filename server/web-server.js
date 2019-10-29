const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { Role, Permission } = require('./authorizer');

const userRoute = require('./route/user');
const roleRoute = require('./route/role');
const permissionRoute = require('./route/permission');
const oauthRoute = require('./route/oauth');

const config = require('./config');

const createLogger = require('./logger');
const logger = createLogger('web-server');

const app = express();
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/user', userRoute);
app.use('/role', roleRoute);
app.use('/permission', permissionRoute);
app.use('/oauth', oauthRoute);

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

if (config.get('NODE_ENV') === 'production') {
  // production mode
  app.use('/', express.static(path.join(__dirname, '..', 'build')));
  app.listen(port, () => logger.info('web server started in production, port', port));
} else if (config.get('NODE_ENV') === 'development') {
  // npm: run dev script to start
  // then web-server
  // eslint-disable-next-line global-require
  require('./web-server.dev')(app, port);
} else {
  throw new Error('not supported app mode!');
}
