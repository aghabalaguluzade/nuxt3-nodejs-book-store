import { defineStore } from 'pinia'
import type { Book } from '~/types'
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
      // return (id: string): Book | undefined => state.books.find((book) => book._id === id);
      return (id: string) => state.books.find((book) => book._id === id)
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
    async getBooks() {
      this.isLoading = true;

      try {
        const config = useRuntimeConfig();
        const response = await $fetch<Book[]>(`${config.public.apiBaseUrl}/books`); 

        this.books = response ?? [];
        
        await this.fetchRatingsForBooks();

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
            await ratingStore.fetchRatingsForBook(book._id as string);

            book.ratings = ratingStore.ratingsForBook;
          } catch (error) {
            console.error('Error at fetchRatingsForBook', error);
          }
        })
      );
    },
    async addBook(newBook: Book) {
      const config = useRuntimeConfig();
      const { $api } = useNuxtApp();

      try {
        const data = await $api<Book>(`${config.public.apiBaseUrl}/books`, {
          method: 'POST',
          body: JSON.stringify(newBook)
        });

        this.books.push(data);
      } catch (error: any) {
        throw error.data;
      }
    },
    async fetchBooksByUploader() {
      const config = useRuntimeConfig();
      const { $api } = useNuxtApp();

      try {
        const response = await $api(`${config.public.apiBaseUrl}/books/uploader`, {
          method: 'GET'
        });

        this.userUploadedBooks = response || [];

      } catch (error: any) {
        throw error.data;
      }
    },
    async deleteTheBook(id: string) {
      const config = useRuntimeConfig();
      const { $api } = useNuxtApp();

      try {
        await $api(`${config.public.apiBaseUrl}/books/${id}`, {
          method: 'DELETE'
        });

        this.books = this.books.filter(book => book._id === id);
      } catch (error: any) {
        throw error.data;
      }
    },
    async editTheBook(bookId: string, book: Book) {
      const config = useRuntimeConfig();
      const { $api } = useNuxtApp();

      try {
        const response = await $api<Book>(`${config.public.apiBaseUrl}/books/${bookId}`, {
          method: 'PUT',
          body: JSON.stringify(book),
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