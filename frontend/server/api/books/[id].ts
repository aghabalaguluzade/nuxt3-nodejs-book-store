import { Book } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const id = event.context.params?.id;
    
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'ID is required' });
    }

    const book: Book = await $fetch(`${config.public.apiBaseUrl}/books/${id}`);

    return book;
  } catch (error: any) {
    console.error('Server-side error:', error);
    const statusCode = error.response?.status || 500;
    const message = error.message || 'Internal Server Error';
    throw createError({ statusCode, statusMessage: message });
  }
})
