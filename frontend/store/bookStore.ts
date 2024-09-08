import { defineStore } from 'pinia'
import type { Book } from '~/types'
import { useAuthStore } from './authStore';

export const useBookStore = defineStore({
  id: 'BookStore',
  state: () => ({
    books: [] as Book[],
    isLoading: false as boolean,
    userUploadedBooks: [] as Book[],
  }),
  getters: {
    selectedBook: (state): any => {
      return (id: number): Book | undefined => state.books.find((book) => book._id === id);
    }
  },
  actions: {
    async getBooks(fresh = false) {
      if (this.books.length > 0 && !fresh) {
        return;
      }

      this.isLoading = true;

      try {
        const { data, error } = await useFetch<Book[]>('/api/books');

        if (error.value) {
          console.error('Error fetching books:', error.value.message);
          this.isLoading = false;
        } else {
          this.books = data.value || [];
          this.isLoading = false;
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async addBook(newBook: Book) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      try {
        const data: Book = await $fetch<Book>('/api/books/book', {
          method: 'POST',
          body: JSON.stringify(newBook),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          }
        });

        this.books.push(data);
      } catch (error) {
        throw error.data;
      }
    },
    async fetchBooksByUploader() {
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        // const data = await $fetch<Book[]>('/api/books/uploader');
        const response = await $fetch(`${config.public.apiBaseUrl}/books/uploader`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
        });

        this.userUploadedBooks = response || [];

      } catch (error) {
        throw error.data;
      }
    },
    async deleteTheBook(id: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();

      try {
        await $fetch(`${config.public.apiBaseUrl}/books/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        this.books = this.books.filter(book => book._id === id);
      } catch (error) {
        throw error.data;
      }
    },
    async editTheBook(bookId: number, book: Book) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();

      try {
        const response = await $fetch(`${config.public.apiBaseUrl}/books/${bookId}`, {
          method: 'PUT',
          body: JSON.stringify(book),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          }
        });

        const updatedBookData = response.book;

        const bookIndex = this.books.findIndex((book) => book._id === bookId);
        if (bookIndex !== -1) {
          this.books.splice(bookIndex, 1, updatedBookData);
        }

      } catch (error) {
        throw error.data;
      }
    }
  }
})