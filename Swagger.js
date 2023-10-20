const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon Epargne API',
      version: '1.0.0',
      description: 'Documentation MonEpargne',
    },
  },
  // Listez ici les fichiers de route que vous souhaitez documenter.
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
