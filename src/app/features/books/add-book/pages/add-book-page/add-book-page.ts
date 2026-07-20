import {Component, inject, signal} from '@angular/core';
import {BookService} from '../../../../../core/services/book.service';
import {Router} from '@angular/router';
import {BookFormModel} from '../../../../../core/models/book-form.model';
import {finalize} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';
import {BookForm} from '../../../components/book-form/book-form';

@Component({
  selector: 'app-add-book-page',
  imports: [
    TranslatePipe,
    BookForm
  ],
  templateUrl: './add-book-page.html',
  styleUrl: './add-book-page.scss',
})
export class AddBookPage {
  private readonly bookService = inject(BookService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly submitError = signal(false);

  createBook(book: BookFormModel): void {
    this.submitting.set(true);
    this.submitError.set(false);

    this.bookService.createBook(book).pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: () => {
          this.submitError.set(true);
        },
      });
  }
}
