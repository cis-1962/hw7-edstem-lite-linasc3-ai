import express from 'express';
import dotenv from 'dotenv';

// read environment variables from .env file
dotenv.config();
const PORT = process.env.PORT ?? 8000;

const app = express();

// define root route
app.get('/', (_, res) => {
  res.send('Hello, backend!');
});

// listen
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Now listening on port ${PORT}.`);
});
