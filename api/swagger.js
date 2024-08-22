import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";

const app = express();

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "API documentation for the library management system",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
