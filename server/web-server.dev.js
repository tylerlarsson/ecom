const { resolve } = require('path');
const ngrok = require('ngrok');
const setup = require('./core/webpack/frontendMiddleware');
const createLogger = require('./core/logger');
const logger = createLogger('web-server.dev');

module.exports = (app, port) => {
  // If you need a backend, e.g. an API, add your custom backend-specific middleware here
  // app.use('/api', myApi);

  // In production we need to pass these values in instead of relying on webpack
  setup(app, {
    outputPath: resolve(process.cwd(), 'build'),
    publicPath: '/'
  });

  // use the gzipped bundle
  app.get('*.js', (req, res, next) => {
    req.url = req.url + '.gz'; // eslint-disable-line
    res.set('Content-Encoding', 'gzip');
    next();
  });

  app.listen(port, async () => {
    try {
      const url = await ngrok.connect(port);
      logger.info('dev web server started', url, port);
    } catch (error) {
      return logger.error(error);
    }
  });
};
