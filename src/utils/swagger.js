import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "3.0.0",
      title: "NeuroGuard API Documentaion",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:4000/",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const spec = swaggerJSDoc(options);

export default spec;
