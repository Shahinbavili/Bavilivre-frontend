import {Component, inject, input} from '@angular/core';
import {Book} from '../../../../core/models/book.model';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '../../../../core/auth/auth.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-book-card',
  imports: [DatePipe, TranslatePipe, RouterLink],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {

  readonly authService = inject(AuthService);
  readonly currentUser = this.authService.currentUser;
  readonly book = input.required<Book>();
}
