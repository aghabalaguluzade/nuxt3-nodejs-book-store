import { defineStore } from 'pinia'
import type { ApiResponse, Rating } from '~/types';
import { useBookStore } from './bookStore';

export const useRatingStore = defineStore({
  id: 'RatingStore',
  state: () => ({
    ratings: [] as Rating[],
    ratingsForBook: [] as Rating[]
  }),
  actions: {
    async addNewRate(newRate: Rating) {
      try {
        const config = useRuntimeConfig();
        const { $api } = useNuxtApp();
        const response = await $api<ApiResponse<Rating>>(`${config.public.apiBaseUrl}/ratings`, {
          method: 'POST',
          body: JSON.stringify(newRate),
        });

        this.ratings.push(response.rate);
        
      } catch (error: any) {
        console.error('Error adding rate:', error);
        throw error.data;
      }
    },
    async fetchRatingsForBook(bookId: string) {
      try {
        const config = useRuntimeConfig();
        const bookStore = useBookStore();
        const response = await $fetch<ApiResponse<Rating>>(`${config.public.apiBaseUrl}/ratings/book/${bookId}`);
        
        this.ratingsForBook = response.ratings ?? [];

        const bookIndex = bookStore.books.findIndex((book) => book._id === bookId);

        if(bookIndex !== -1) {
          bookStore.books[bookIndex].ratings = response.ratings ?? [];
        }else {
          console.warn('Book with id ' + bookId + 'not found');
        }
        
      } catch (error: any) {
        throw error.data;
      }
    }
  }
})