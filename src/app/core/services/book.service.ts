import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from '../models/book.model';
import {BorrowedBooksDto} from '../dto/borrowed-books.dto';
import {LentBooksDto} from '../dto/lent-books.dto';
import {API_BASE_URL} from '../config/api.config';
import {PageResponseModel} from '../../features/books/models/page-response.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = API_BASE_URL;

  getBooks(): Observable<PageResponseModel<Book>> {
    return this.http.get<PageResponseModel<Book>>(`${this.apiUrl}/api/books`);
  }

  getBorrowedBooks(userId: number): Observable<BorrowedBooksDto> {
    return this.http.get<BorrowedBooksDto>(
      `${this.apiUrl}/users/${userId}/borrowed-books`
    );
  }

  getLentBooks(userId: number): Observable<LentBooksDto> {
    return this.http.get<LentBooksDto>(
      `${this.apiUrl}/users/${userId}/lent-books`
    );
  }

  getBookById(bookId: number): Observable<Book> {
    return this.http.get<Book>(
      `${this.apiUrl}/books/${bookId}`
    );
  }
}
