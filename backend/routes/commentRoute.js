import express from 'express';
import * as commentController from '../controllers/commentController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router
  .route('/')
  .post(authMiddleware.authenticateUser, commentController.store);

router.route('/book/:id').get(commentController.getCommentsForBook);

export default router;