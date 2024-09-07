import express from "express";
import * as bookController from "../controllers/bookController.js";
import * as authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router
   .route('/')
   .get(bookController.index)
   .post(authMiddleware.authenticateUser, bookController.store);

router
   .route('/uploader')
   .get(authMiddleware.authenticateUser, bookController.getBooksByUploader);

router
   .route('/:id')
   .get(bookController.show)
   .put(bookController.update)
   .delete(authMiddleware.authenticateUser, bookController.destroy);


export default router;