const swaggerUiExpress = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion API Coder",
      description: "Documentacion Swagger",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

const specs = swaggerJSDoc(swaggerOptions);

module.exports = {
  setupSwagger: (app) => {
    app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
  },
};
