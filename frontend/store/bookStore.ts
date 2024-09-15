import { defineStore } from 'pinia'
import type { Book } from '~/types'
import { useAuthStore } from './authStore';
import { useRatingStore } from './ratingStore';

export const useBookStore = defineStore({
  id: 'BookStore',
  state: () => ({
    books: [] as Book[],
    isLoading: false as boolean,
    userUploadedBooks: [] as Book[],
  }),
  getters: {
    selectedBook: (state) => {
      return (id: string): Book | undefined => state.books.find((book) => book._id === id);
    },
    latest5Books: (state) => {
      return state.books
        .filter(book => book.createdAt)
        .sort((a, b) => {
          const dateA = new Date(a.createdAt!);
          const dateB = new Date(b.createdAt!);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5);
    },
    rated5Books: (state) => {
      const sortedBooks = state.books.sort((a, b) => {
        const averageRatingA =
          (a.ratings?.reduce((sum, rating) => sum + rating.rate, 0) ?? 0) / 
          (a.ratings?.length ?? 1);
        const averageRatingB =
          (b.ratings?.reduce((sum, rating) => sum + rating.rate, 0) ?? 0) / 
          (b.ratings?.length ?? 1);
    
        return averageRatingB - averageRatingA;
      });
    
      return sortedBooks.slice(0, 5);
    }
    
  },
  actions: {
    async getBooks(fresh = false) {
      if (this.books.length > 0 && !fresh) {
        return;
      }

      this.isLoading = true;

      try {
        const config = useRuntimeConfig();
        const response = await $fetch<Book[]>(`${config.public.apiBaseUrl}/books`); 

        this.books = response ?? [];
        await this.fetchRatingsForBooks();
        this.isLoading = false;

      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchRatingsForBooks() {
      const ratingStore = useRatingStore();

      await Promise.all(
        this.books.map(async (book) => {
          try {
            await ratingStore.fetchRatingsForBook(book._id);

            book.ratings = ratingStore.ratingsForBook;
          } catch (error) {
            console.error('Error at fetchRatingsForBook', error);
          }
        })
      );
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
      } catch (error: any) {
        throw error.data;
      }
    },
    async fetchBooksByUploader() {
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        // const data = await $fetch<Book[]>('/api/books/uploader');
        const response = await $fetch<Book[]>(`${config.public.apiBaseUrl}/books/uploader`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
        });

        this.userUploadedBooks = response || [];

      } catch (error: any) {
        throw error.data;
      }
    },
    async deleteTheBook(id: string) {
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
      } catch (error: any) {
        throw error.data;
      }
    },
    async editTheBook(bookId: string, book: Book) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();

      try {
        const response = await $fetch<Book>(`${config.public.apiBaseUrl}/books/${bookId}`, {
          method: 'PUT',
          body: JSON.stringify(book),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          }
        });

        const updatedBookData = response.book ?? [];

        const bookIndex = this.books.findIndex((book) => book._id === bookId);
        if (bookIndex !== -1) {
          this.books.splice(bookIndex, 1, updatedBookData);
        }

      } catch (error: any) {
        throw error.data;
      }
    }
  }
})