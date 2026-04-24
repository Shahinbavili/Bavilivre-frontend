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
];
