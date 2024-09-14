import User from "../models/User.js";
import { checkValidationErrors, isValidObjectId, findDocumentById } from "../utils/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getAllUsers = async (req, res) => {
   const users = await User.find();
   
   res.status(200).json(users);
};

const register = async (req, res) => {
   try {
      const { email } = req.body;

      const exitsingEmail = await User.findOne({ email });

      if (exitsingEmail) {
         return res.status(400).json({ error: 'The email is already exist!' });
      };

      const newUser = await User.create(req.body);

      res.status(201).json({ message: 'User created successfully', user: newUser, token });

   } catch (error) { 
      // Handle validation errors
      if (error.name === 'ValidationError') {
         if (checkValidationErrors(error, res)) return;
      } else {
         console.error("Error at register user", error);
         return res.status(500).json({ error: 'Internal Server ERROR' });
      }
   }
};

const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({ error: 'User not found!' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
         return res.status(401).json({ error: 'Password is not valid!' });
      }

      const expirationTime = 60 * 60 * 24 * 7;

      const token = jwt.sign({ userId : user._id }, process.env.JWT_TOKEN_KEY, { expiresIn: expirationTime });

      return res.status(200).json({ message: 'User logged in successfully!', user, token });
   } catch (error) {
      console.error("Error at login user", error);
      return res.status(500).json({ error: 'Internal Server ERROR' });
   }
};

const destroy = async (req, res) => {
   const { id } = req.params;

   if (isValidObjectId(id, res)) return;

   try {
      const user = await findDocumentById(User, id, res);

      if (!user) return;

      await user.deleteOne();

      res.status(200).json({ message: 'User was successfully destroyed' });
   } catch (error) {
      console.error("Error at deleting user", error);
      return res
         .status(500)
         .json({ error: 'Internal Server ERROR' });
   }
};

export {
   register,
   login,
   getAllUsers,
   destroy
};