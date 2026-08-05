import {Component, input, output} from '@angular/core';
import {Book} from '../../../../core/models/book.model';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-book-card',
  imports: [DatePipe, TranslatePipe, RouterLink],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {

  readonly book = input.required<Book>();
  readonly isOwner = input(false);
  readonly isArchiving = input(false);

  readonly archiveRequested = output<Book>()

  protected requestArchive(): void {
    this.archiveRequested.emit(this.book());
  }
}
