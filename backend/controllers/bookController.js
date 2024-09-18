import path from 'path';
import fs from 'fs/promises';
import { __dirname } from '../utils/pathUtils.js';
import Book from "../models/Books.js";
import { isValidObjectId, findDocumentById, checkValidationErrors } from "../utils/index.js";

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

const uploadFile = async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = req.file.path;
      res.status(200).json({ message: 'File uploaded successfully', filePath });
   } catch (error) {
      console.error('Error uploading file', error);
      res.status(500).json({ error: 'Internal Server ERROR' });
   }
};

const store = async (req, res) => {
   try {
      const { name, author, description, page, image, premium } = req.body;
      const uploader = req.user._id;

      const existingBook = await Book.findOne({ name, author });

      if (existingBook) {
         return res.status(400).json({ error: 'A book with same name and author already exist!' });
      };

      // const image = req.file ? req.file.path : null;
      console.log('Image path:', image || 'No file');

      const newBook = await Book.create({
         name,
         author,
         description,
         page,
         uploader,
         image,
         premium
      });

      return res.status(201).json({
         message: 'Book created successfully',
         books: newBook
      });

   } catch (error) {
      // Handle validation errors
      if (error.name === 'ValidationError') {
         if (checkValidationErrors(error, res)) return;
      } else {
         console.error("Error at creating book", error);
         return res
            .status(500)
            .json({ error: 'Internal Server ERROR' });
      }
   }
};

const getBooksByUploader = async (req, res) => {
   try {
      const uploaderId = req.user._id;

      const books = await Book.find({ uploader: uploaderId });

      return res.status(200).json(books);

   } catch (error) {
      console.error('Error at getBooksByUploader', error);

      return res.status(500).json({ error: 'Internal Server error' });
   }
};

const show = async (req, res) => {

   const { id } = req.params;

   if (isValidObjectId(id, res)) return;

   try {

      const book = await findDocumentById(Book, id, res);

      if (!book) return;

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
   const { name, author, description, page, premium } = req.body;

   if (isValidObjectId(id, res)) return;

   try {
      const book = await findDocumentById(Book, id, res);

      if (!book) return;

      book.name = name || book.name;
      book.author = author || book.author;
      book.description = description || book.description;
      book.page = page || book.page;
      book.premium = premium || book.premium;

      await book.save(book);

      res.status(200).json({ message: 'Book saved successfully', book: book });

   } catch (error) {
      console.error("Error at updating book", error);
      return res
         .status(500)
         .json({ error: 'Internal Server ERROR' });
   }

};

const destroy = async (req, res) => {
   const { id } = req.params;

   if (isValidObjectId(id, res)) return;

   try {
      const book = await findDocumentById(Book, id, res);

      if (!book) return;

      const imagePath = book.image;
      const fullPath = path.join(__dirname, '..', 'public', 'uploads', path.basename(imagePath));

      await fs.unlink(fullPath);
      await book.deleteOne();

      res.status(200).json({ message: 'Book was successfully destroyed' });

   } catch (error) {
      console.error("Error at deleting book", error);
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
   destroy,
   getBooksByUploader,
   uploadFile
}