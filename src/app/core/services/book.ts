import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from '../models/book.model';
import {BorrowedBooksDto} from '../models/borrowed-books.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080';

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
  }

  getBorrowedBooks(userId: number) {
    return this.http.get<BorrowedBooksDto>(
      `${this.apiUrl}/users/${userId}/borrowed-books`
    );
  }
}
