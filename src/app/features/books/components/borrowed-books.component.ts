import {Component, inject} from '@angular/core';
import {BookService} from '../../../core/services/book';
import {KeyValuePipe} from '@angular/common';

@Component({
  selector: 'app-borrowed-books',
  standalone: true,
  template: `
    <h2>Borrowed books</h2>

    <ul>
      @for (book of borrowedBooks | keyvalue; track book.key) {
        <li>
          Book {{ book.key }} from user {{ book.value }}
        </li>
      }
    </ul>
  `,
  imports: [
    KeyValuePipe
  ]
})
export class BorrowedBooksComponent {
  private bookService = inject(BookService);

  borrowedBooks: Record<number, number> = {};

  ngOnInit() {
    this.bookService.getBorrowedBooks(1).subscribe(dto => {
      this.borrowedBooks = dto.borrowedBookList;
    });
  }
}
