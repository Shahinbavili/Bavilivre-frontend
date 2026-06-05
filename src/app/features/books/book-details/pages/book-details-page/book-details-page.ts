import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../../../../../core/services/book.service';
import {Book} from '../../../../../core/models/book.model';
import {TranslatePipe} from '@ngx-translate/core';
import {LoadingSpinner} from '../../../../../shared/components/loading-spinner/loading-spinner';
import {User} from '../../../../../core/models/user.model';
import {UserService} from '../../../../../core/services/user.service';

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
  private readonly userService = inject(UserService);

  readonly book = signal<Book | null>(null);
  readonly owner = signal<User | null>(null);
  readonly isLoading = signal(true)
  readonly errorMessage = signal<string | null>(null)

  ngOnInit(): void {

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const bookId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.bookService.getBookById(bookId).subscribe({
      next: (book: Book) => {
        this.book.set(book);
        this.isLoading.set(false);
        this.userService.getUserById(book.ownerId).subscribe({
          next: (user: User) => {
            this.owner.set(user);
          },
          error: (error) => {
            console.error(error);
            this.errorMessage.set('common.error');
          }
        });
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('common.error');
        this.isLoading.set(false);
      }
    });

  }
}
