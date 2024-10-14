// 基本的な型定義
export type BookStatus = 'unread' | 'reading' | 'completed';

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  publisher: string;
  rating: number;
  comment: string;
  status: BookStatus;
  favorite: boolean;
  created_at: string;
  updated_at: string;
  book_tags: BookTag[];
  cover_image?: string;
}

export interface RecommendedBook {
  book_title: string;
  book_author: string;
  book_publisher: string;
  title?: string;
  author?: string;
  publisher?: string;
  description?: string;
  thumbnail?: string;
}
export interface DisplayBook {
  title: string;
  author: string;
  publisher: string;
}
export interface User {
  id: string;
  email: string;
  username: string;
  bio: string;
}

export interface Tag {
  id: string;
  name: string;
  user_id: string;
}

export interface BookTag {
  id: string;
  book_id: string;
  tag_id: string;
  user_id: string;
  tag: Tag;
}

export interface FavoriteAuthor {
  id: string;
  user_id: string;
  author_name: string;
}

export interface Loan {
  id: string;
  user_id: string;
  book_id: string;
  borrower_name: string;
  loan_date: string;
  return_date: string | null;
}

// Supabase用のDatabase型定義
export interface Database {
  public: {
    Tables: {
      books: {
        Row: Book;
        Insert: Omit<Book, 'id' | 'book_tags'>;
        Update: Partial<Omit<Book, 'book_tags'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id'>;
        Update: Partial<User>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, 'id'>;
        Update: Partial<Tag>;
      };
      book_tags: {
        Row: BookTag;
        Insert: Omit<BookTag, 'id'>;
        Update: Partial<BookTag>;
      };
      favorite_authors: {
        Row: FavoriteAuthor;
        Insert: Omit<FavoriteAuthor, 'id'>;
        Update: Partial<FavoriteAuthor>;
      };
      loans: {
        Row: Loan;
        Insert: Omit<Loan, 'id'>;
        Update: Partial<Loan>;
      };
      recommended_books: {
        Row: RecommendedBook;
        Insert: Omit<RecommendedBook, 'user_id' | 'book_id' | 'last_updated'>;
        Update: Partial<Omit<RecommendedBook, 'user_id' | 'book_id'>>;
      };
    };
  };
}