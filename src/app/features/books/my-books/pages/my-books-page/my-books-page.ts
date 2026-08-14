import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {BookService} from '../../../../../core/services/book.service';
import {Book} from '../../../../../core/models/book.model';
import {finalize} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';
import {LoadingSpinner} from '../../../../../shared/components/loading-spinner/loading-spinner';
import {BookCard} from '../../../components/book-card/book-card';

@Component({
  selector: 'app-my-books-page',
  imports: [
    TranslatePipe,
    LoadingSpinner,
    BookCard
  ],
  templateUrl: './my-books-page.html',
  styleUrl: './my-books-page.scss',
})
export class MyBooksPage implements OnInit {

  private readonly bookService = inject(BookService);

  readonly books = signal<Book[]>([]);

  readonly loading = signal(true);
  readonly loadError = signal(false);

  readonly currentPage = signal(0);
  readonly pageSize = signal(12);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);

  readonly pageSizeOptions = [12, 24, 48];

  hasPreviousPage = computed(
    () => this.currentPage() > 0
  );

  hasNextPage = computed(
    () =>
      this.totalPages() > 0 &&
      this.currentPage() < this.totalPages() - 1,
  );

  ngOnInit() {
    this.loadMyBooks();
  }

  protected previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    this.currentPage.update(page => page - 1);
    this.loadMyBooks();
  }

  protected nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    this.currentPage.update(page => page + 1);
    this.loadMyBooks();
  }

  protected onPageSizeChange(size: string): void {
    const parsedSize = Number(size);

    if (!this.pageSizeOptions.includes(parsedSize)) {
      return;
    }

    this.pageSize.set(parsedSize);
    this.currentPage.set(0);
    this.loadMyBooks();
  }

  private loadMyBooks(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.bookService.getMyBooks(
      this.currentPage(),
      this.pageSize(),
    ).pipe(
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: response => {
        this.books.set(response.content);
        this.currentPage.set(response.page);
        this.pageSize.set(response.size);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages)
      },
      error: () => {
        this.loadError.set(true);
      },
    });
  }
}
