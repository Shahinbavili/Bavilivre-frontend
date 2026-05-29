import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from '../models/book.model';
import {BorrowedBooksDto} from '../dto/borrowed-books.dto';
import {LentBooksDto} from '../dto/lent-books.dto';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080';

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
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
