import mongoose from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   author: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   page: {
      type: Number,
      required: true,
      min: 1
   },
   rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10
   }
},
   {
      timestamps: true
   }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;