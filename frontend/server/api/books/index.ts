import { Book, ErrorResponse } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const books: Book[] = await $fetch(`${config.public.apiBaseUrl}/books`);

    return books;
  } catch (error: any) {
    const statusCode = error.response?.status || 500;
    const message = error.message || 'Internal Server Error';
    const errorResponse: ErrorResponse = { statusCode, message };
    return errorResponse;
  }
});