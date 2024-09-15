import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
   content: {
      type: String,
      required: true
   },
   book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
   },
   postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   upvotes: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
      },
   ],
},
   { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;