import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router
   .post('/register', authController.register)
   .get('/', authController.getAllUsers)
   .delete('/:id', authController.destroy)
   .post('/login', authController.login);

export default router;