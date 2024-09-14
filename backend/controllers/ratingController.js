import Rating from '../models/Rating.js';

const createRating = async (req, res) => {
   try {
      const { bookId, rate, userId } = req.body;

      let existingRating = await Rating.findOne({ book: bookId, ratedBy: userId });

      if (existingRating) {
         existingRating.rate = rate;
         await existingRating.save();
         return res.status(200).json({ message: 'Rating updated successfully', rate: existingRating });
      }

      const newRate = await Rating.create({
         book: bookId,
         ratedBy: userId,
         rate
      });

      return res.status(201).json({ message: 'Rating created successfully', rate: newRate });

   } catch (error) {
      console.error('Error at createOrUpdateRating', error);
      if (error.code === 11000) {
         return res.status(400).json({ error: 'Duplicate rating entry' });
      }
      return res.status(500).json({ error: 'Internal Server error' });
   }
};

const getRatingsForBook = async (req, res) => {
   try {
      const { id } = req.params;
      const ratings = await Rating.find({ book: id }).populate('ratedBy');
      
      return res
         .status(201)
         .json({ message: 'Comments for book fetched', ratings });
   } catch (error) {
      console.error('Error at getRatingsForBook', error);
      return res.status(500).json({ error: 'Internal Server error' });
   }
};

export {
   createRating,
   getRatingsForBook
}