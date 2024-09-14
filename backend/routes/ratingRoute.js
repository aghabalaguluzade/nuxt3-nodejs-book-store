import express from "express";
import * as authMiddleware from '../middleware/authMiddleware.js';
import * as ratingController from '../controllers/ratingController.js';
const router = express.Router();

router
   .route('/')
   .post(authMiddleware.authenticateUser, ratingController.createRating);

router.route('/book/:id').get(ratingController.getRatingsForBook);

export default router;