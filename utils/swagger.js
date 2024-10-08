import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Backend for blog',
    description: 'test'
  },
  host: 'localhost:3000',
  apis: ['./src/routes/register.js', './src/routes/login.js', './src/routes/posts.js', './src/routes/comments.js', './src/routes/likes.js'],
};
const outputFile = './swagger-output.json';
const routes = ['../app.js'];
swaggerAutogen()(outputFile, routes, doc);
