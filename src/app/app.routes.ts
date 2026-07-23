import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page')
        .then(m => m.HomePage),
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
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/pages/login-page/login-page')
        .then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/pages/register-page/register-page')
        .then(m => m.RegisterPage),
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./features/books/book-catalog/pages/book-catalog-page/book-catalog-page')
        .then(m => m.BookCatalogPage),
  },
  {
    path: 'books/add',
    loadComponent: () =>
      import('./features/books/add-book/pages/add-book-page/add-book-page')
        .then(m => m.AddBookPage),
  },
  {
    path: 'books/:id/edit',
    loadComponent: () =>
      import('./features/books/edit-book/pages/edit-book-page/edit-book-page')
        .then(m => m.EditBookPage),
  },
  {
    path: 'books/:id',
    loadComponent: () =>
      import('./features/books/book-details/pages/book-details-page/book-details-page')
        .then(m => m.BookDetailsPage),
  },
];
