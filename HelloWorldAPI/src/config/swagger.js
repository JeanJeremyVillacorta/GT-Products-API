import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Social Media API',
    version: '1.0.0',
    description: 'API documentation for the Social Media Application. Includes Security, Rate Limiting, and File Uploads.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: '',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  // Optional: Remove if you want per-route security
  // security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // or './src/routes/**/*.js' if nested
};

export const swaggerSpec = swaggerJSDoc(options);
