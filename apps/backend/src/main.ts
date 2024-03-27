import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Question from './models/question';
import User from './models/user';

// this file is the entry point for the backend server

// read environment variables from .env file
dotenv.config();
const PORT = process.env.PORT ?? 8000;


// initialize express app 
const app = express(); 

// add a middleware aka a function that handles a request ... simply call app.use() in Express
// body parser middleware is super important in handling JSON data sent in HTTP requests and changing them into JS objects that we can easily work with server-side
// after middleware has parsed JSON payload, it will attach the JS object it created to the REQ (request) object under the req.body property .... req.body is how we can access the parsed data directly

app.use(express.json()) // add body-parser middleware to server using app.use (aka middleware keyword) and express.json() for the specific body-parser functionality 

// place before any routes that might use body-parser functionality ... now any incoming route will go thru the JSON parsing middleware and all data will be accessible in req.body 

// define root route
app.get('/api/hello', (_, res) => {
  res.json({ message: 'Hello, frontend!' });
});

// connect to database
const startServer = async() => {
  try { // wrap in try catch block for error handling in case error arises when connecting to database 
  // 4. Connect to MongoDB
  await mongoose.connect('mongodb+srv://linasc:<password>@hw7.2wtfqct.mongodb.net/?retryWrites=true&w=majority&appName=HW7');

  console.log("Connected"); 

  // listen only after you've established the database connection 
  app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Now listening on port ${PORT}.`);
});
  } catch (error) { 
    console.error("Failed to connect to MongoDB", error)
  }
}; 


startServer(); 
