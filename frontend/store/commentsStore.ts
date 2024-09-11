import { defineStore } from 'pinia'
import type { ApiResponse, Comment, commentsForBook } from '~/types';

export const useCommentsStore = defineStore({
  id: 'CommentsStore',
  state: () => ({
    comments: [] as Comment[],
    commentsForBook: [] as commentsForBook[],
  }),
  actions: {
    async addNewComment(newComment: Comment) {
      try {
        const config = useRuntimeConfig();
        const { $api } = useNuxtApp();
        const response = await $api(`${config.public.apiBaseUrl}/comments`, {
          method: 'POST',
          body: JSON.stringify(newComment),
        });

        this.comments.push(response.comment);

      } catch (error) {
        throw error.data;
      }
    },
    async fetchCommentsForBook(bookId: number) {
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<ApiResponse<commentsForBook>>(`${config.public.apiBaseUrl}/comments/book/${bookId}`);

        this.commentsForBook = response.comments;
      } catch (error) {
        throw error.data;
      }
    }
  }
})