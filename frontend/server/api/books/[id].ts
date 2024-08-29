import { Book } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'ID is required' });
    }

    const book: Book = await $fetch(`http://localhost:5000/api/v1/books/${id}`);

    return book;
  } catch (error: any) {
    console.error('Server-side error:', error);
    const statusCode = error.response?.status || 500;
    const message = error.message || 'Internal Server Error';
    throw createError({ statusCode, statusMessage: message });
  }
})
