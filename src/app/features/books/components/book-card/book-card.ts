import {Component, input} from '@angular/core';
import {Book} from '../../../../core/models/book.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-book-card',
  imports: [DatePipe],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {
  readonly book = input.required<Book>();
}
