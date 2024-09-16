import { defineStore } from 'pinia'
import type { ApiResponse, Comment } from '~/types';
import { useAuthStore } from './authStore';

export const useCommentsStore = defineStore({
  id: 'CommentsStore',
  state: () => ({
    comments: [] as Comment[],
    commentsForBook: [] as Comment[],
    commentsByUser: [] as Comment[],
  }),
  actions: {
    async fetchComments() {
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<ApiResponse<Comment>>(`${config.public.apiBaseUrl}/comments`);

        this.comments = response.comments ?? [];
      } catch (error) {
        console.error('Error at fetching comments', error);
      }
    },
    async addNewComment(newComment: Comment) {
      try {
        const config = useRuntimeConfig();
        const { $api } = useNuxtApp();
        await $api<Comment>(`${config.public.apiBaseUrl}/comments`, {
          method: 'POST',
          body: JSON.stringify(newComment),
        });

        await this.fetchComments();

        // this.comments.push(response.comment);

      } catch (error: any) {
        throw error.data;
      }
    },
    async updateComment(commentId: string, comment: string) {
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
        const response = await $fetch<ApiResponse<Comment>>(`${config.public.apiBaseUrl}/comments/book/${bookId}`);

        this.commentsForBook = response.comments ?? [];
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
    },
    async upvoteComment(commentId: string) {
      try {
        const config = useRuntimeConfig();
        const { $api } = useNuxtApp();
        const response = await $api(`${config.public.apiBaseUrl}/comments/${commentId}/upvote`, {
          method: 'POST'
        });

        const updateComment = response.comment;

        const commentIndex = this.comments.findIndex((comment) => comment._id === updateComment._id);

        if(commentIndex !== -1) {
          this.comments[commentIndex] = updateComment;
        }
      } catch (error: any) {
        throw error.data;
      }
    },
    async downvoteComment(commentId: string) {
      try {
        const config = useRuntimeConfig();
        const { $api } = useNuxtApp();
        const  response = await $api(`${config.public.apiBaseUrl}/comments/${commentId}/downvote`, {
          method: 'POST'
        });
        
        const updateComment = response.comment;

        const commentIndex = this.comments.findIndex((comment) => comment._id === updateComment._id);

        if(commentIndex !== -1) {
          this.comments[commentIndex] = updateComment;
        }

      } catch (error: any) {
        throw error.data;
      }
    }
  }
})