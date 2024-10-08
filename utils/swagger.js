import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Backend',
      version: '1.0.0',
      description: 'API documentation for blog backend',
    },
  },
  apis: ['./src/routes/register.js', './src/routes/login.js', './src/routes/posts.js', './src/routes/comments.js', './src/routes/likes.js'],
};
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;