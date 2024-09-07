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
      }finally {
        this.isLoading = false;
      }
    },
    async addBook(newBook: Book) {
      const authStore = useAuthStore();
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
        const data = await $fetch<Book[]>('/api/books/uploader');

        this.userUploadedBooks = data || [];

      } catch (error) {
        throw error.data;
      }
    }
  }

})