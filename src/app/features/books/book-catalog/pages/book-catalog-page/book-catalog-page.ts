import {Component, inject, OnInit, signal} from '@angular/core';
import {BookService} from '../../../../../core/services/book.service';
import {Book} from '../../../../../core/models/book.model';
import {finalize} from 'rxjs';
import {BookCard} from '../../../components/book-card/book-card';

@Component({
  selector: 'app-book-catalog-page',
  imports: [BookCard],
  templateUrl: './book-catalog-page.html',
  styleUrl: './book-catalog-page.scss',
})
export class BookCatalogPage implements OnInit {

  private readonly bookService = inject(BookService);

  readonly books = signal<Book[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  ngOnInit() {
    this.loadBooks();
  }

  private loadBooks() {
    this.loading.set(true);
    this.loadError.set(false);

    this.bookService.getBooks().pipe(
      finalize(() => this.loading.set(false)))
      .subscribe({
          next: response => {
            this.books.set(response.content);
          },
          error: error => {
            console.error('Failed to load books', error);
            this.loadError.set(true);
          }
        }
      )
  }
}
