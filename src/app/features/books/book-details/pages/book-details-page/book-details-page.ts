import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../../../../../core/services/book.service';
import {Book} from '../../../../../core/models/book.model';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-book-details-page',
  imports: [
    TranslatePipe
  ],
  templateUrl: './book-details-page.html',
  styleUrl: './book-details-page.scss',
})
export class BookDetailsPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);

  readonly book = signal<Book | null>(null);

  ngOnInit(): void {

    const bookId = Number(
      this.route.snapshot.params['id']
    );

    this.bookService.getBookById(bookId).subscribe({
      next: (book: Book) => {
        this.book.set(book);
      },
      error: (error) => {
        console.error(error);
      }
    });

  }
}
