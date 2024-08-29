export interface Book {
   _id: number;
   name: string;
   author: string;
   description: string;
   page: number;
   rating: number;
   createdAt: number;
   updatedAt: number;
}

export interface ErrorResponse {
   statusCode: number;
   message: string;
}