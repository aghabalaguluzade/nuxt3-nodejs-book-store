import express from "express";
import cors from "cors";
import connectDatabase from "./config/db.js";
import bookRoute from './routes/bookRoute.js';

const app = express();
const port = 5000;

const corsPortOptions = {
   origin: 'http://localhost:3000',
   credentials: true
};

app.use(cors(corsPortOptions));
app.use(express.json());

// routes
app.use('/api/v1/books', bookRoute);

try {
   //connection to the DB
   await connectDatabase();
   
   app.listen(port, (err, res) => {
      console.log(`Server listening on ${port}`);
   });
} catch (error) {
   process.exit(1);
}