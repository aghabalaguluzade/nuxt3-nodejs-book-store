import express from "express";
import * as bookController from "../controllers/bookController.js";

const router = express.Router();

router
   .route('/')
   .get(bookController.index)
   .post(bookController.store);

router
   .route('/:id')
   .get(bookController.show)
   .put(bookController.update)
   .delete(bookController.destroy);

export default router;