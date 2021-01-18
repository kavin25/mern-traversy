module.exports = {
  swaggerOptions: {
    swaggerDefinition: {
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
    },
    apis: ["routes/api/items.js"],
  },
  swaggerUIOptions: {
    customCss: ".swagger-ui .topbar { display: none }",
  },
};
