import swaggerJsdoc from "swagger-jsdoc";
import glob from "glob";
import path from "path";

/**
 * @type {swaggerJsdoc.Options}
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Resume Builder Api",
      version: "1.0.0",
      contact: "mahmoudelzoka@gmail.com",
      license: "MIT",
    },
  },
  apis: [
    ...glob.sync(`${path.normalize(__dirname)}/../controllers/*.js`),
    ...glob.sync(`${path.normalize(__dirname)}/../app.js`),
  ],
};

export default swaggerJsdoc(options);
