import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

import {BookService} from '../../../../../core/services/book.service';
import {BorrowedBooksDto} from '../../../../../core/dto/borrowed-books.dto';
import {Book} from '../../../../../core/models/book.model';
import {UserService} from '../../../../../core/services/user.service';
import {User} from '../../../../../core/models/user.model';
import {LoadingSpinner} from '../../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-borrowed-books-page',
  standalone: true,
  templateUrl: './borrowed-books-page.html',
  imports: [
    TranslatePipe,
    LoadingSpinner
  ]
})
export class BorrowedBooksPage implements OnInit {

  private readonly bookService = inject(BookService);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  protected readonly translate = inject(TranslateService);

  readonly borrowedBooks = signal<Record<number, number>>({});
  readonly books = signal<Record<number, Book>>({});
  readonly users = signal<Record<number, User>>({});
  readonly isLoading = signal(true);

  readonly borrowedBookEntries = computed(() =>
    Object.entries(this.borrowedBooks())
      .map(([bookId, lenderId]) => ({
        bookId: Number(bookId),
        lenderId,
      }))
  );

  ngOnInit(): void {

    const userId = Number(this.route.snapshot.paramMap.get('id'));

    this.isLoading.set(true);

    this.bookService.getBorrowedBooks(userId).subscribe({
      next: (dto: BorrowedBooksDto) => {
        this.borrowedBooks.set(dto.borrowedBookList);
        this.isLoading.set(false);

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
              this.isLoading.set(false);
            }
          });
        });
        const lenderIds = Object.values(dto.borrowedBookList);

        lenderIds.forEach((lenderId) => {
          this.userService.getUserById(lenderId).subscribe({
            next: (user: User) => {
              this.users.update((currentUsers) => ({
                ...currentUsers,
                [user.id]: user,
              }));
            }
          })
        })
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  borrowedBookLabel(entry: { bookId: number; lenderId: number }): string {
    const book = this.books()[entry.bookId];
    const lender = this.users()[entry.lenderId];

    if (!book) {
      return this.translate.instant('books.borrowed.loadingBook', {
        bookId: entry.bookId,
      });
    }

    if (!lender) {
      return this.translate.instant('users.loadingUser', {
        userId: entry.lenderId,
      });
    }

    return this.translate.instant('books.borrowed.item', {
      title: book.title,
      author: book.author,
      lenderName: lender.displayName,
    });

  }
}

