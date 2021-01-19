module.exports = {
  swaggerOptions: {
    swaggerDefinition: {
      openapi: "3.0.1",
      info: {
        title: "Items API",
        description: "Items API for use case",
        contact: {
          name: "Kavin",
        },
        servers: [
          {
            url: "http://localhost:5000",
            description: "Local Development Server",
          },
        ],
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "x-auth-token",
          },
        },
      },
    },
    apis: ["routes/api/*.js"],
  },
  swaggerUIOptions: {
    customCss: ".swagger-ui .topbar { display: none }",
  },
};
