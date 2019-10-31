const swaggerJSDoc = require('swagger-jsdoc');
const config = require('./config');

const swaggerDefinition = {
  basePath: config.get('base-path'),
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header'
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./server/web-server.js', './server/route/*.js']
};

module.exports = swaggerJSDoc(options);
