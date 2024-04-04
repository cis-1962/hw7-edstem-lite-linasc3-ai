import express, { ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Question from './models/question';
import User from './models/user';
import cookieSession from 'cookie-session'; // needed for authentication 
import questionRoutes from './routes/questions';
import accountRoutes from './routes/account';

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

// also add cookie session middleware 
app.use(cookieSession({
  name: 'session',
  keys: ['secretkey1', 'secretkey2'], // our secret keys to authenticate the session 
  maxAge: 24 * 60 * 60 * 1000 // sets how long the cookie will be valid in miliseconds. 24 hours. 
}));

// define root route ... UPDATE so you set proper routes for these 


// use router with path prefix 
app.use('/api', questionRoutes);

// use router with path prefix 
app.use('/api/account', accountRoutes);


// define error handling middleware
// place after .use calls so it catches errors 
// based off express docs 
// take in error, request, response, and next 
// all errors from routes should be thrown here 
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack); // provide stack trace for debugging 

  // Check the type of error or use the error message to set the HTTP status code
  const statusCode = err.message.startsWith('Unauthorized') ? 401 : 500;

  // Respond to the client with the error message
  res.status(statusCode).send({
      error: err.message || 'An unexpected error occurred.',
  });
}

app.use(errorHandler);

// left these here so database can be accessed for grading, 
// but in theory should be in .env file  
// const username = encodeURIComponent("lchihoub");
// const password = encodeURIComponent("Flj1umf1Zq1B9uYl");

const dbUsername = encodeURIComponent(db.env.DB_USERNAME);
const dbPassword = encodeURIComponent(db.env.DB_PASSWORD);
const dbHost = db.env.DB_HOST;
const dbName = db.env.DB_NAME; 



// connect to database
const startServer = async() => {
  try { // wrap in try catch block for error handling in case error arises when connecting to database 
  // 4. Connect to MongoDB
  await mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=${dbName}`);

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
