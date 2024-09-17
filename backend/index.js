import express from "express";
import cors from "cors";
import path from 'path';
import { __dirname } from './utils/pathUtils.js';
import connectDatabase from "./config/db.js";
import bookRoute from './routes/bookRoute.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import commentRoute from './routes/commentRoute.js';
import ratingRoute from './routes/ratingRoute.js';

const app = express();
const port = 5000;

const corsPortOptions = {
   origin: 'http://localhost:3000',
   credentials: true
};

// Middleware configuration
app.use(cors(corsPortOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload configuration
app.use(express.static("public"));

// Routes configuration
app.use('/api/v1/books', bookRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/comments', commentRoute);
app.use('/api/v1/ratings', ratingRoute);

try {
   //connection to the DB
   await connectDatabase();
   
   app.listen(port, () => {
      console.log(`Server listening on ${port}`);
   });
} catch (error) {
   process.exit(1);
}