import { defineStore } from 'pinia'
import type { ApiResponse, Comment, commentsForBook } from '~/types';

export const useCommentsStore = defineStore({
  id: 'CommentsStore',
  state: () => ({
    comments: [] as Comment[],
    commentsForBook: [] as commentsForBook[],
    commentsByUser: [],
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

      } catch (error: any) {
        throw error.data;
      }
    },
    async updateComment(commentId: number, comment: string) {
      const config = useRuntimeConfig();
      const { $api } = useNuxtApp();
      try {
        const response = await $api(`${config.public.apiBaseUrl}/comments/${commentId}}`, {
          method: 'PUT',
          body: JSON.stringify(comment),
        });

        const updatedComment = response.comments;

        const bookIndex = this.comments.findIndex((comment) => comment._id === commentId);
        if (bookIndex !== -1) {
          this.comments.splice(bookIndex, 1, updatedComment);
        }

      } catch (error: any) {
        throw error.data;
      } 
    },
    async fetchCommentsForBook(bookId: number) {
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<ApiResponse<commentsForBook>>(`${config.public.apiBaseUrl}/comments/book/${bookId}`);

        this.commentsForBook = response.comments;
      } catch (error: any) {
        throw error.data;
      }
    },
    async fetchCommentsByUser(userId: number) {
      try {
        const config = useRuntimeConfig();
        const { $api } = useNuxtApp();
        const response = await $api(`${config.public.apiBaseUrl}/comments/user/${userId}`);        

        this.commentsByUser = response.comments;

      } catch (error: any) {
        throw error.data;
      }
    }
  }
})