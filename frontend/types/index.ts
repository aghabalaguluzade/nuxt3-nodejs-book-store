export interface Book {
   book: any;
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
   _id?: number;
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

export interface Comment {
   _id?: number;
   content: string;
   book: number;
   postedBy: User;
   createdAt?: string;
   updatedAt?: string;
}

export interface ApiResponse<T> {
   comments: T[];
}

export interface commentsForBook {
   comment: Comment;
   postedBy: User;
}