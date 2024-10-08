import { isValidObjectId, findDocumentById } from '../utils/index.js';
import Comment from '../models/Comment.js';

const getAllComments = async (req, res) => {
   try {
      const comments = await Comment.find().populate({
         path: 'postedBy',
         select: 'username'
      });

      res.status(200).json({ message: 'Comments fetched', comments });
   } catch (error) {
      console.error('Error at getAllComments', error);
      return res.status(500).json({ error: 'Internal Server error' });
   }
};

const store = async (req, res) => {
   try {
      const { bookId, content, userId } = req.body;

      const newComment = await Comment.create({
         content: content,
         book: bookId,
         postedBy: userId,
      });

      return res
         .status(201)
         .json({ message: 'Comment created succesfully', comment: newComment });

   } catch (error) {
      console.error('Error at createAComment', error);
      return res.status(500).json({ error: 'Internal Server error' });
   }
}

const getCommentsForBook = async (req, res) => {
   try {
      const { id } = req.params;
      const comments = await Comment.find({ book: id }).populate('postedBy');

      return res
         .status(201)
         .json({ message: 'Comments for book fetched', comments });
   } catch (error) {
      console.error('Error at getCommentsForBook', error);
      return res.status(500).json({ error: 'Internal Server error' });
   }
};

const getCommentsByUser = async (req, res) => {
   try {
      const { id } = req.params;

      const comments = await Comment.find({ postedBy: id }).populate('book');

      return res
         .status(200)
         .json({ message: 'Comments for book fetched', comments });

   } catch (error) {
      console.error('Error at getCommentsByUser', error);
      return res.status(500).json({ error: 'Internal Server error' });
   }
};

const update = async(req, res) => {
   const { id } = req.params;
   const { content } = req.body;

   if(isValidObjectId(id, res)) return;
   
   try {
      const comment = await findDocumentById(Comment, id, res);

      if(!comment) return;

      comment.comment = comment;

      await comment.save(comment);

      res.status(200).json({ message: 'Comment saved successfully', comment });

   } catch (error) {
      console.error("Error at updating comment", error);
      return res
         .status(500)
         .json({ error: 'Internal Server ERROR' });
   }
};

const upvoteComment = async (req, res) => {
   try {
      const commentId = req.params.id;
      const userId =  req.user._id;

      const comment = await Comment.findById(commentId);

      comment.upvotes.push(userId);

      await comment.save();

      return res.status(200).json({ message: 'Upvoted successfully', comment });

   } catch (error) {
      return res.status(500).json({ error: 'Internal Server error' });
   }
};

const downvoteComment = async (req, res) => {
   try {
      const commentId = req.params.id;
      const userId = req.user._id;

      const comment = await Comment.findById(commentId);

      comment.upvotes = comment.upvotes.filter((upvote) => upvote.toString() !== userId.toString());

      await comment.save();

      return res.status(200).json({ message: 'Upvoted successfully', comment });
   }catch (error) {
      console.error('Error at upvoteComment', error);
      return res.status(500).json({ error: 'Internal Server error' });
   }
};

const destroy = async (req, res) => {
   
   const { id } = req.params;
   
   if(isValidObjectId(id, res)) return;

   try {

      const comment = await findDocumentById(Comment, id, res);

      if (!comment) return;

      await comment.deleteOne();

      res.status(200).json({ message: 'Comment was successfully destroyed' });

   } catch (error) {
      console.error("Error at deleting book", error);
      return res
         .status(500)
         .json({ error: 'Internal Server ERROR' });
   }
};

export {
   getAllComments,
   store,
   getCommentsForBook,
   getCommentsByUser,
   update,
   upvoteComment,
   downvoteComment,
   destroy
}