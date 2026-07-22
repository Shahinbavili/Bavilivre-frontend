import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {BookService} from '../../../../../core/services/book.service';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LentBooksDto} from '../../../../../core/dto/lent-books.dto';
import {LoadingSpinner} from '../../../../../shared/components/loading-spinner/loading-spinner';
import {Book} from '../../../../../core/models/book.model';
import {User} from '../../../../../core/models/user.model';
import {UserService} from '../../../../../core/services/user.service';

@Component({
  selector: 'app-lent-books-page',
  standalone: true,
  imports: [TranslatePipe, LoadingSpinner],
  templateUrl: './lent-books-page.html',
  styleUrl: './lent-books-page.scss',
})
export class LentBooksPage implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  protected readonly translate = inject(TranslateService);

  readonly lentBooks = signal<Record<number, number>>({});
  readonly books = signal<Record<number, Book>>({});
  readonly users = signal<Record<number, User>>({});
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null)

  readonly lentBooksEntries = computed(() =>
    Object.entries(this.lentBooks()).map(([bookId, borrowerId]) => ({
      bookId: Number(bookId),
      borrowerId
    })),
  );

  ngOnInit(): void {

    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(userId) || userId <= 0) {
      this.errorMessage.set('common.error');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.bookService.getLentBooks(userId).subscribe({
      next: (dto: LentBooksDto) => {
        this.lentBooks.set(dto.lentBookList);
        this.isLoading.set(false);

        const bookIds = Object.keys(dto.lentBookList).map(Number);

        bookIds.forEach(bookId => {
          this.bookService.getBookById(bookId).subscribe({
            next: book => {
              this.books.update(current => ({
                ...current,
                [book.id]: book,
              }));
            },
            error: () => {
              this.errorMessage.set('common.error');
            },
          });
        });

        const borrowerIds = [...new Set(Object.values(dto.lentBookList))];

        borrowerIds.forEach(borrowerId => {
          this.userService.getUserById(borrowerId).subscribe({
            next: user => {
              this.users.update(current => ({
                ...current,
                [user.id]: user,
              }));
            },
            error: () => {
              this.errorMessage.set('common.error');
            },
          });
        });
      },
      error: () => {
        this.errorMessage.set('common.error');
        this.isLoading.set(false);
      }
    });
  }

  lentBookLabel(entry: { bookId: number, borrowerId: number }): string {
    const book = this.books()[entry.bookId];
    const borrower = this.users()[entry.borrowerId];

    if (!book) {
      return this.translate.instant('books.lent.loadingBook', {
        bookId: entry.bookId,
      });
    }

    if (!borrower) {
      return this.translate.instant('users.loadingUser', {
        userId: entry.borrowerId,
      });
    }

    return this.translate.instant('books.lent.item', {
      title: book.title,
      author: book.author,
      borrowerName: borrower.displayName,
    });
  }
}
