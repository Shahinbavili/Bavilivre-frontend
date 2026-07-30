import {Component, inject, OnInit, signal} from '@angular/core';
import {finalize} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

import {Book} from '../../../../../core/models/book.model';
import {BookService} from '../../../../../core/services/book.service';
import {BookCard} from '../../../components/book-card/book-card';

@Component({
  selector: 'app-book-catalog-page',
  imports: [BookCard, TranslatePipe],
  templateUrl: './book-catalog-page.html',
  styleUrl: './book-catalog-page.scss',
})
export class BookCatalogPage implements OnInit {
  private readonly bookService = inject(BookService);

  readonly books = signal<Book[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  readonly searchTitle = signal('');
  readonly selectedSort = signal('-createdAt');


  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.bookService.getBooks({
      title: this.searchTitle(),
      sort: this.selectedSort(),
    })
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: response => {
          this.books.set(response.content);
        },
        error: error => {
          console.error('Failed to load books', error);
          this.loadError.set(true);
        },
      });
  }

  protected onSortChange(sort: string): void {
    this.selectedSort.set(sort);
    this.loadBooks();
  }

  protected onSearchChange(title: string) {
    this.searchTitle.set(title.trim());
    this.loadBooks();
  }
}
