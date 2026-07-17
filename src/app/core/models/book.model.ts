export interface Book {
  id: number;
  ownerId: number;
  title: string;
  author: string;
  description: string;
  language: string;
  category: string;
  available: boolean;
  archived: boolean;
  createdAt: String;
}
