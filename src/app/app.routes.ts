import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home')
        .then(m => m.Home),
  },
  {
    path: 'users/:id/borrowed-books',
    loadComponent: () =>
      import('./features/books/borrowed-books/borrowed-books')
        .then(m => m.BorrowedBooks),
  },
  {
    path: 'users/:id/lent-books',
    loadComponent: () =>
      import('./features/books/lent-books/lent-books')
        .then(m => m.LentBooks),
  },
];
