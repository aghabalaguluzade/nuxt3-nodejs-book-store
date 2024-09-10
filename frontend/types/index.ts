export interface Book {
   _id?: number;
   name: string;
   author: string;
   description: string;
   page?: number | null;
   rating?: number;
   createdAt?: number;
   updatedAt?: number;
   editedBookId?: number | null;
}

export interface User {
   username?: string;
   email: string;
   password: string;
   admin?: boolean;
   createdAt?: number;
   updatedAt?: number;
}

export interface ErrorResponse {
   statusCode?: number;
   message?: string;
}

export interface CarouselItem {
  imageUrl: string;
  subtitle: string;
  title: string;
  description: string;
}