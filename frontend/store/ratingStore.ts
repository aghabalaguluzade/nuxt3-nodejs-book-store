import { defineStore } from 'pinia'
import type { ApiResponse, Rating } from '~/types';

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

        const index = this.ratingsForBook.findIndex(r => r.ratedBy._id === newRate.ratedBy && r.book === newRate.book);
        if (index !== -1) {
          this.ratingsForBook[index] = response.rate;
        } else {
          this.ratingsForBook.push(response.rate);
        }
        
      } catch (error: any) {
        console.error('Error adding rate:', error);
        throw error.data;
      }
    },
    async fetchRatingsForBook(bookId: string) {
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<ApiResponse<Rating>>(`${config.public.apiBaseUrl}/ratings/book/${bookId}`);
              
        this.ratingsForBook = response.ratings ?? [];
      } catch (error: any) {
        throw error.data;
      }
    }
  }
})