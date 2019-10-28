const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  basePath: '/', // Base path (optional)
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
