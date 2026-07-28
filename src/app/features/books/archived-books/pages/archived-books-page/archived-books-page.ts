import {Component, inject, OnInit, signal} from '@angular/core';
import {Book} from '../../../../../core/models/book.model';
import {BookService} from '../../../../../core/services/book.service';
import {finalize} from 'rxjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LoadingSpinner} from '../../../../../shared/components/loading-spinner/loading-spinner';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-archived-books-page',
  imports: [
    TranslatePipe,
    LoadingSpinner
  ],
  templateUrl: './archived-books-page.html',
  styleUrl: './archived-books-page.scss',
})
export class ArchivedBooksPage implements OnInit {
  readonly archivedBooks = signal<Book[]>([]);
  readonly isLoading = signal(true);
  readonly restoringBookId = signal<number | null>(null);
  readonly errorMessage = signal<string | null>(null);

  private readonly bookService = inject(BookService);
  private readonly translate = inject(TranslateService);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.bookService.getArchivedBooks().pipe(
      finalize(() => this.isLoading.set(false)),
    )
      .subscribe({
        next: (books: Book[]) => {
          this.archivedBooks.set(books);
        },
        error: () => {
          this.errorMessage.set('books.archived.error');
        },
      })
  }

  unarchiveBook(book: Book): void {
    const confirmed = window.confirm(
      this.translate.instant('books.archived.confirmation',
        {title: book.title},
      ),
    );

    if (!confirmed) {
      return;
    }

    this.restoringBookId.set(book.id);
    this.errorMessage.set(null);

    this.bookService.unArchiveBook(book.id).pipe(
      finalize(() => this.restoringBookId.set(null)),
    )
      .subscribe({
        next: () => {
          this.archivedBooks.update(books => books.filter(
            currentBook => currentBook.id !== book.id)
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleUnarchiveError(error);
        }
      })
  }

  private handleUnarchiveError(error: HttpErrorResponse) {
    switch (error.status) {
      case 403:
        this.errorMessage.set('books.archived.forbidden');
        break;

      case 404:
        this.errorMessage.set('books.archived.notFound');
        break;

      default:
        this.errorMessage.set('books.archived.error');
    }
  }
}
