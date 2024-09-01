import { defineStore } from 'pinia'
import type { Book } from '~/types'

export const useBookStore = defineStore({
  id: 'BookStore',
  state: () => ({
    books: [] as Book[],
    isLoading: false as boolean
  }),
  getters: {
    selectedBook: (state): any => {
      return (id: number) => state.books.find((book) => book._id === id);
    }
  },
  actions: {
    async getBooks(fresh = false) {
        if (this.books.length > 0 && !fresh) {
            return;
        }

        this.isLoading = true;

        const { data, error } = await useFetch('/api/books');

        if (error.value) {
            console.error('Error fetching books:', error.value.message);
            this.isLoading = false;
        } else {
            this.books = data.value || [];
            this.isLoading = false;
        }
    }
  }

})