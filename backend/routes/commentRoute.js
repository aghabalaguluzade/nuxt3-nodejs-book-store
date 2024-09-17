import express from 'express';
import * as commentController from '../controllers/commentController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router
  .route('/')
  .get(commentController.getAllComments)
  .post(authMiddleware.authenticateUser, commentController.store);

router
  .route('/:id')
  .put(authMiddleware.authenticateUser, commentController.update)
  .delete(authMiddleware.authenticateUser, commentController.destroy);

router
  .route('/:id/upvote')
  .post(authMiddleware.authenticateUser, commentController.upvoteComment);

router
  .route('/:id/downvote')
  .post(authMiddleware.authenticateUser, commentController.downvoteComment);

router.route('/book/:id').get(commentController.getCommentsForBook);

router
  .route('/user/:id')
  .get(authMiddleware.authenticateUser, commentController.getCommentsByUser);

export default router;