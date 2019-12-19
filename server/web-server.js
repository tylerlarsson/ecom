const path = require('path');
const spdy = require('spdy');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./core/swagger');
const config = require('./config');
const createLogger = require('./core/logger');
const logger = createLogger('web-server');
const API = config.get('base-path');

const app = express();
app.use(bodyParser.json());
app.use(`${API}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require('./route/course')(app);
require('./route/role')(app);
require('./route/permission')(app);
require('./route/pricing-plan')(app);
require('./route/user')(app);
require('./route/navigation')(app);
require('./route/filter')(app);
require('./route/navigation')(app);
require('./route/file')(app);
require('./route/oauth')(app);

const port = config.get('web-app:port');
const spdyOptions = {
  key: fs.readFileSync(''), // have to add in production env
  cert: fs.readFileSync(''), // have to add in production env
  spdy: {
    requestCert: true,
    protocols: ['h2', 'spdy/3.1', 'spdy/3', 'spdy/2', 'http/1.1', 'http/1.0']
  }
};

/* istanbul ignore next */
if (config.get('NODE_ENV') === 'production') {
  // production mode
  app.use('/', express.static(path.join(__dirname, '..', 'build')));
  spdy.createServer(spdyOptions, app).listen(port, () => {
    logger.info('web server started in production, port', port);
  });
} else if (config.get('NODE_ENV') === 'development') {
  // npm: run dev script to start
  // then web-server
  // eslint-disable-next-line global-require
  require('./web-server.dev')(app, port);
} else if (config.get('NODE_ENV') === 'test') {
  module.exports = app;
} else {
  throw new Error('not supported app mode!');
}
