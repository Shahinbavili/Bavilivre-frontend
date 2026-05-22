export interface Borrowing {
  id: number;
  bookId: number;
  borrowerId: number;
  lenderId: number;
  borrowedAt: string;
  returnedAt: string | null;
}
