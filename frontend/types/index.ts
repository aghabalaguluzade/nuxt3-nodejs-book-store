export interface Book {
   _id?: string;
   name: string;
   author: string;
   description: string;
   page?: number | null;
   rating?: number;
   ratings?: Rating[];
   createdAt?: string | null;
   updatedAt?: string | null;
   editedBookId?: string | null;
}

export interface User {
   _id?: string;
   username?: string;
   email: string;
   password: string;
   admin?: boolean;
   createdAt?: string;
   updatedAt?: string;
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

export interface Comment {
   _id?: string;
   content: string;
   book: number;
   postedBy: User;
   createdAt?: string;
   updatedAt?: string;
}

export interface ApiResponse<T> {
   message: string;
   ratings?: T[];
   comments?: T[];
}

export interface Rating {
   _id: string;
   book: number;
   ratedBy: User;
   rate: number;
   createdAt?: string;
   updatedAt?: string;
}