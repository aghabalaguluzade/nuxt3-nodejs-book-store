import express from "express";
import cors from "cors";
import connectDatabase from "./config/db.js";
import bookRoute from './routes/bookRoute.js';
import authRoute from './routes/authRoute.js';

const app = express();
const port = 5000;

const corsPortOptions = {
   origin: 'http://127.0.0.1:3000',
   credentials: true
};

// Middleware configuration
app.use(cors(corsPortOptions));
app.use(express.json());

// Routes configuration
app.use('/api/v1/books', bookRoute);
app.use('/api/v1/auth', authRoute);

try {
   //connection to the DB
   await connectDatabase();
   
   app.listen(port, () => {
      console.log(`Server listening on ${port}`);
   });
} catch (error) {
   process.exit(1);
}