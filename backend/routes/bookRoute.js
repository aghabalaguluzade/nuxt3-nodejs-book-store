import express from "express";
import * as bookController from "../controllers/bookController.js";
import * as authMiddleware from "../middleware/authMiddleware.js";
import upload from "../utils/fileUpload.js";

const router = express.Router();

router
   .route('/')
   .get(bookController.index)
   .post(authMiddleware.authenticateUser, bookController.store);

router.post('/upload', authMiddleware.authenticateUser, upload.single('image'), bookController.uploadFile);

router
   .route('/uploader')
   .get(authMiddleware.authenticateUser, bookController.getBooksByUploader);

router
   .route('/:id')
   .get(bookController.show)
   .put(authMiddleware.authenticateUser, bookController.update)
   .delete(authMiddleware.authenticateUser, bookController.destroy);


export default router;