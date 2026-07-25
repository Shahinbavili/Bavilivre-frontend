import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {finalize} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

import {BookService} from '../../../../../core/services/book.service';
import {UserService} from '../../../../../core/services/user.service';
import {AuthService} from '../../../../../core/auth/auth.service';
import {Book} from '../../../../../core/models/book.model';
import {User} from '../../../../../core/models/user.model';
import {LoadingSpinner} from '../../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-book-details-page',
  imports: [
    TranslatePipe,
    LoadingSpinner,
    RouterLink,
  ],
  templateUrl: './book-details-page.html',
  styleUrl: './book-details-page.scss',
})
export class BookDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  readonly book = signal<Book | null>(null);
  readonly owner = signal<User | null>(null);
  readonly currentUser = this.authService.currentUser;

  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const bookId = Number(
      this.route.snapshot.paramMap.get('id'),
    );

    if (!Number.isInteger(bookId) || bookId <= 0) {
      this.errorMessage.set('common.error');
      this.isLoading.set(false);
      return;
    }

    this.loadBook(bookId);
  }

  private loadBook(bookId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.bookService.getBookById(bookId).subscribe({
      next: (book: Book) => {
        this.book.set(book);
        this.loadOwner(book.ownerId);
      },
      error: () => {
        this.errorMessage.set('common.error');
        this.isLoading.set(false);
      },
    });
  }

  private loadOwner(ownerId: number): void {
    this.userService
      .getUserById(ownerId)
      .pipe(
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (user: User) => {
          this.owner.set(user);
        },
        error: () => {
          this.errorMessage.set('common.error');
        },
      });
  }
}
