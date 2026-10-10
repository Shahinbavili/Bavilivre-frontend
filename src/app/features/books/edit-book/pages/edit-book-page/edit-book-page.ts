import {Component, inject, OnInit, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {BookForm} from '../../../components/book-form/book-form';
import {BookFormModel} from '../../../../../core/models/book-form.model';
import {ActivatedRoute, Router} from '@angular/router';
import {BookService} from '../../../../../core/services/book.service';
import {Book} from '../../../../../core/models/book.model';
import {finalize} from 'rxjs';
import {LoadingSpinner} from '../../../../../shared/components/loading-spinner/loading-spinner';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-edit-book-page',
  imports: [
    TranslatePipe,
    BookForm,
    LoadingSpinner,
    MatIcon
  ],
  templateUrl: './edit-book-page.html',
  styleUrl: './edit-book-page.scss',
})
export class EditBookPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookService = inject(BookService);

  readonly bookId = signal<number | null>(null);
  readonly initialValue = signal<BookFormModel | null>(null);

  readonly isLoading = signal(true);
  readonly loadError = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal(false);

  ngOnInit() {

    const bookId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(bookId) || bookId <= 0) {
      this.loadError.set(true);
      this.isLoading.set(false);
      return;
    }

    this.bookId.set(bookId);

    this.bookService.getBookById(bookId).subscribe({
      next: (book: Book) => {

        this.initialValue.set({
          title: book.title,
          author: book.author,
          description: book.description,
          language: book.language,
          category: book.category,
        });

        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  updateBook(book: BookFormModel): void {
    const bookId = this.bookId();

    if (bookId === null) {
      this.submitError.set(true);
      return;
    }

    this.submitting.set(true);
    this.submitError.set(false);

    this.bookService.updateBook(bookId, book).pipe(
      finalize(() => this.submitting.set(false)),
    )
      .subscribe({
        next: () => {
          void this.router.navigate(['/books']);
        },
        error: () => {
          this.submitError.set(true);
        },
      });
  }

  cancel(): void {
    const bookId = this.bookId();

    if (bookId !== null) {
      void this.router.navigate(['/books', bookId]);
    }
  }
}
