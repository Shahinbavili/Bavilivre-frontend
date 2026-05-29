import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

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

  protected readonly translate = inject(TranslateService);

  readonly borrowedBooks = signal<Record<number, number>>({});
  readonly books = signal<Record<number, Book>>({});

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

        const bookIds = Object.keys(dto.borrowedBookList).map(Number);

        bookIds.forEach((bookId) => {
          this.bookService.getBookById(bookId).subscribe({
            next: (book: Book) => {
              this.books.update((currentBooks) => ({
                ...currentBooks,
                [book.id]: book,
              }));
            },
            error: (error) => {
              console.error(error);
            }
          });
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  borrowedBookLabel(entry: { bookId: number; lenderId: number }): string {
    const book = this.books()[entry.bookId];

    if (!book) {
      return this.translate.instant('books.borrowed.loadingBook', {
        bookId: entry.bookId,
      });
    }

    return this.translate.instant('books.borrowed.item', {
      title: book.title,
      author: book.author,
      lenderId: entry.lenderId,
    });

  }
}

