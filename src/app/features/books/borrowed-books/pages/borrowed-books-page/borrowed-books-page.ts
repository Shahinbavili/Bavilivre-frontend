import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

import {BookService} from '../../../../../core/services/book.service';
import {BorrowedBooksDto} from '../../../../../core/dto/borrowed-books.dto';
import {Book} from '../../../../../core/models/book.model';

@Component({
  selector: 'app-borrowed-books-page',
  standalone: true,
  templateUrl: './borrowed-books-page.html',
  imports: [
    TranslatePipe
  ]
})
export class BorrowedBooksPage implements OnInit {

  private readonly bookService = inject(BookService);
  private readonly route = inject(ActivatedRoute);

  readonly borrowedBooks = signal<Record<number, number>>({});
  readonly books = signal<Book[]>([]);

  readonly borrowedBookEntries = computed(() =>
    Object.entries(this.borrowedBooks())
      .map(([bookId, lenderId]) => ({
        bookId: Number(bookId),
        lenderId,
      }))
  );

  ngOnInit(): void {

    const userId = Number(this.route.snapshot.paramMap.get('id'));

    this.bookService.getBorrowedBooks(userId).subscribe({
      next: (dto: BorrowedBooksDto) => {
        this.borrowedBooks.set(dto.borrowedBookList);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
