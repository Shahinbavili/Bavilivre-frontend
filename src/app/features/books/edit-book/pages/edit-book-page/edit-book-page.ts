import {Component, inject, OnInit, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {BookForm} from '../../../components/book-form/book-form';
import {BookFormModel} from '../../../../../core/models/book-form.model';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../../../../../core/services/book.service';
import {Book} from '../../../../../core/models/book.model';

@Component({
  selector: 'app-edit-book-page',
  imports: [
    TranslatePipe,
    BookForm
  ],
  templateUrl: './edit-book-page.html',
  styleUrl: './edit-book-page.scss',
})
export class EditBookPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);

  readonly initialValue = signal<BookFormModel | null>(null);

  readonly isLoading = signal(true);
  readonly submitting = signal(false);
  readonly submitError = signal(false);

  ngOnInit() {

    const bookId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(bookId) || bookId <= 0) {
      this.submitError.set(true);
      this.isLoading.set(false);
      return;
    }

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

        this.submitError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  updateBook(book: BookFormModel): void {
    console.log(book);
  }
}
