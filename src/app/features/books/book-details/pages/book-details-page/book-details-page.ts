import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../../../../../core/services/book.service';
import {Book} from '../../../../../core/models/book.model';
import {TranslatePipe} from '@ngx-translate/core';
import {LoadingSpinner} from '../../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-book-details-page',
  imports: [
    TranslatePipe,
    LoadingSpinner
  ],
  templateUrl: './book-details-page.html',
  styleUrl: './book-details-page.scss',
})
export class BookDetailsPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);

  readonly book = signal<Book | null>(null);
  readonly isLoading = signal(true);

  ngOnInit(): void {

    this.isLoading.set(true);

    const bookId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.bookService.getBookById(bookId).subscribe({
      next: (book: Book) => {
        this.book.set(book);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.isLoading.set(false);
      }
    });

  }
}
