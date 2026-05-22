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
      import('./features/books/borrowed-books/pages/borrowed-books-page/borrowed-books-page')
        .then(m => m.BorrowedBooksPage),
  },
  {
    path: 'users/:id/lent-books',
    loadComponent: () =>
      import('./features/books/lent-books/pages/lent-books-page/lent-books-page')
        .then(m => m.LentBooksPage),
  },
];
