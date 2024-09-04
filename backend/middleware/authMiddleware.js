import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticateUser = async (req, res, next) => {
   const authHeader = req.headers;

   if(!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing!' });
   }

   const tokenParts = authHeader.split(' ');

   if(tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid auth header format' });
   }

   const token = tokenParts[1];
   
   try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);

      req.user = await User.findById(decoded.userId);

      next();

   } catch (error) {
      throw error;
   }

};

export {
   authenticateUser
}