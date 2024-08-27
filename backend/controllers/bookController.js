import Book from "../models/Books.js";
import { isValidObjectId, findDocumentById } from "../utils/index.js";

const index = async (req, res) => {
   try {
      const books = await Book.find();

      res.status(200).json(books);
   } catch (error) {
      console.error("Error at creating book", error);
      return res
         .status(500)
         .json({ error: 'Internal Server ERROR' });
   }
};

const store = async (req, res) => {
   try {

      const { name, author } = req.body;

      const existingBook = await Book.findOne({ name, author });

      if (existingBook) {
         return res.status(400).json({ error: 'A book with same name and author already exist!' });
      };

      const newBook = await Book.create(req.body);

      return res.status(201).json({
         message: 'Book created successfully',
         books: newBook
      });
   } catch (error) {
      // Handle validation errors
      if (error.name === 'ValidationError') {
         const validationErrorMessage = {}

         for (let field in error.errors) {
            validationErrorMessage[field] = error.errors[field].message;
         }

         return res
            .status(400)
            .json({ error: 'Validation error', validationErrorMessage });

      } else {
         console.error("Error at creating book", error);
         return res
            .status(500)
            .json({ error: 'Internal Server ERROR' });
      }
   }
};

const show = async (req, res) => {

   const { id } = req.params;

   if(isValidObjectId(id, res)) return;

   try {

      const book = await findDocumentById(Book, id, res);

      if(! book) return;

      return res.status(200).json(book);

   } catch (error) {
      console.error("Error at creating book", error);
      return res
         .status(500)
         .json({ error: 'Internal Server ERROR' });
   }

};

const update = async (req, res) => {
   const { id } = req.params;
   const { name, author, description, page, rating } = req.body;

   if(isValidObjectId(id, res)) return;

   try {
      const book = await findDocumentById(Book, id, res);

      if(! book) return;

      book.name = name || book.name;
      book.author = author || book.author;
      book.description = description || book.description;
      book.page = page || book.page;
      book.rating = rating || book.rating;

      await book.save(book);

      res.status(200).json({ message: 'Book saved successfully', book: book });

   } catch (error) {
      console.error("Error at creating book", error);
      return res
         .status(500)
         .json({ error: 'Internal Server ERROR' });
   }

};

const destroy = async (req, res) => {
   const { id } = req.params;

   if(isValidObjectId(id, res)) return;

   try {
      const book = await findDocumentById(Book, id, res);

      if(! book) return;

      await book.deleteOne();

      res.status(200).json({ message: 'Book was successfully destroyed' });
   } catch (error) {
      console.error("Error at creating book", error);
      return res
         .status(500)
         .json({ error: 'Internal Server ERROR' });
   }

};

export {
   index,
   store,
   show,
   update,
   destroy
}