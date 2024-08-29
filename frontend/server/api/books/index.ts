import { Book, ErrorResponse } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const books: Book[] = await $fetch('http://localhost:5000/api/v1/books');

    return books;
  } catch (error: any) {
    const statusCode = error.response?.status || 500;
    const message = error.message || 'Internal Server Error';
    const errorResponse: ErrorResponse = { statusCode, message };
    return errorResponse;
  }
});