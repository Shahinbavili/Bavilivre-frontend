import {Component, inject, OnInit, signal} from '@angular/core';
import {Book} from '../../../../../core/models/book.model';
import {BookService} from '../../../../../core/services/book.service';
import {finalize} from 'rxjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LoadingSpinner} from '../../../../../shared/components/loading-spinner/loading-spinner';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmationDialog} from '../../../../../shared/components/confirmation-dialog/confirmation-dialog';
import {ConfirmationDialogData} from '../../../../../shared/components/confirmation-dialog/confirmation-dialog-data';

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

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

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
    const dialogRef = this.dialog.open<
      ConfirmationDialog,
      ConfirmationDialogData,
      boolean
    >(ConfirmationDialog, {
      data: {
        title: this.translate.instant('books.archived.dialogTitle'),
        message: this.translate.instant(
          'books.archived.confirmation',
          {title: book.title},
        ),
        confirmLabel: this.translate.instant('books.actions.unarchive'),
        cancelLabel: this.translate.instant('common.actions.cancel'),
        destructive: false,
      },
      direction: this.translate.getCurrentLang() === 'fa' ? 'rtl' : 'ltr',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.performUnarchive(book);
    });
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

  private performUnarchive(book: Book): void {
    this.restoringBookId.set(book.id);
    this.errorMessage.set(null);

    this.bookService.unArchiveBook(book.id).pipe(
      finalize(() => this.restoringBookId.set(null)),
    )
      .subscribe({
        next: () => {
          this.archivedBooks.update(books =>
            books.filter(currentBook => currentBook.id !== book.id),
          );

          this.snackBar.open(
            this.translate.instant('books.archived.success'),
            this.translate.instant('common.actions.close'),
            {
              duration: 6000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              direction:
                this.translate.getCurrentLang() === 'fa' ? 'rtl' : 'ltr',
              politeness: 'polite',
              panelClass: [
                'app-snackbar',
                'app-snackbar--success',
              ],
            },
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleUnarchiveError(error);
        },
      });
  }
}
