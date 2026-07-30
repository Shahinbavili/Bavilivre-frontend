import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from '../models/book.model';
import {BorrowedBooksDto} from '../dto/borrowed-books.dto';
import {LentBooksDto} from '../dto/lent-books.dto';
import {API_BASE_URL} from '../config/api.config';
import {PageResponseModel} from '../../features/books/models/page-response.model';
import {BookFormModel} from '../models/book-form.model';
import {BookQueryParams} from '../models/book-query-params';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = API_BASE_URL;

  getBooks(params: BookQueryParams = {}): Observable<PageResponseModel<Book>> {

    let httpParams = new HttpParams();

    if (params.title?.trim()) {
      httpParams = httpParams.set('title', params.title.trim());
    }

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page);
    }

    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size);
    }

    if (params.language) {
      httpParams = httpParams.set('language', params.language);
    }

    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }

    if (params.available !== undefined) {
      httpParams = httpParams.set('available', params.available);
    }

    return this.http.get<PageResponseModel<Book>>(
      `${this.apiUrl}/api/books`,
      {params: httpParams}
    );
  }

  getBorrowedBooks(userId: number): Observable<BorrowedBooksDto> {
    return this.http.get<BorrowedBooksDto>(
      `${this.apiUrl}/api/users/${userId}/borrowed-books`
    );
  }

  getLentBooks(userId: number): Observable<LentBooksDto> {
    return this.http.get<LentBooksDto>(
      `${this.apiUrl}/api/users/${userId}/lent-books`
    );
  }

  getBookById(bookId: number): Observable<Book> {
    return this.http.get<Book>(
      `${this.apiUrl}/api/books/${bookId}`
    );
  }

  createBook(book: BookFormModel): Observable<Book> {
    return this.http.post<Book>(
      `${this.apiUrl}/api/books`,
      book
    );
  }

  updateBook(bookId: number, book: BookFormModel): Observable<Book> {
    return this.http.put<Book>(
      `${this.apiUrl}/api/books/${bookId}`,
      book
    );
  }

  archiveBook(bookId: number): Observable<Book> {
    return this.http.patch<Book>(
      `${this.apiUrl}/api/books/${bookId}/archive`,
      {},
    );
  }

  getArchivedBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.apiUrl}/api/books/archived`,
    );
  }

  unArchiveBook(bookId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/api/books/${bookId}/unarchive`,
      {}
    )
  }
}
