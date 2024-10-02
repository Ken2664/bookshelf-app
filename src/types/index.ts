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
  bookTag: BookTag[];
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
  tag: Tag;
  user_id: string;
}

export interface FavoriteAuthor {
  id: string;
  user_id: string;
  author_name: string;
}

export interface Loan {
  user_id: string;
  id: string;
  book_id: string;
  borrower_name: string;
  loan_date: string;
  return_date: string | null;
}

// Supabase用のDatabase型定義
export interface Database {
  public: {
    Tables: {
      Book: {
        Row: Book;
        Insert: Omit<Book, 'id'>;
        Update: Partial<Book>;
      };
      User: {
        Row: User;
        Insert: Omit<User, 'id'>;
        Update: Partial<User>;
      };
      Tag: {
        Row: Tag;
        Insert: Omit<Tag, 'id'>;
        Update: Partial<Tag>;
      };
      BookTag: {
        Row: BookTag;
        Insert: Omit<BookTag, 'id'>;
        Update: Partial<BookTag>;
      };
      FavoriteAuthor: {
        Row: FavoriteAuthor;
        Insert: Omit<FavoriteAuthor, 'id'>;
        Update: Partial<FavoriteAuthor>;
      };
      Loan: {
        Row: Loan;
        Insert: Omit<Loan, 'id'>;
        Update: Partial<Loan>;
      };
    };
  };
}