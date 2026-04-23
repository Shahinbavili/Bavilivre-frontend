import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users/1/borrowed-books',
    pathMatch: 'full'
  },
  {
    path: 'users/:id/borrowed-books',
    loadComponent: () =>
      import('./features/books/components/borrowed-books.component')
        .then(m => m.BorrowedBooksComponent),
  },
];
