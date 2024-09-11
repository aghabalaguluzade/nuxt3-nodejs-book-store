import express from "express";
import cors from "cors";
import connectDatabase from "./config/db.js";
import bookRoute from './routes/bookRoute.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import commentRoute from './routes/commentRoute.js';

const app = express();
const port = 5000;

const corsPortOptions = {
   origin: 'http://localhost:3000',
   credentials: true
};

// Middleware configuration
app.use(cors(corsPortOptions));
app.use(express.json());

// Routes configuration
app.use('/api/v1/books', bookRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/comments', commentRoute);

try {
   //connection to the DB
   await connectDatabase();
   
   app.listen(port, () => {
      console.log(`Server listening on ${port}`);
   });
} catch (error) {
   process.exit(1);
}