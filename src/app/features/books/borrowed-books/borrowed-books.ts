import {Component, inject, signal} from '@angular/core';
import {BookService} from '../../../core/services/book';
import {KeyValuePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-borrowed-books',
  templateUrl: './borrowed-books.html',
  imports: [
    KeyValuePipe,
    TranslatePipe
  ]
})
export class BorrowedBooks {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);


  borrowedBooks = signal<Record<number, number>>({});

  ngOnInit() {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    console.log(userId);

    this.bookService.getBorrowedBooks(userId).subscribe(dto => {
      console.log(dto);
      this.borrowedBooks.set(dto.borrowedBookList);
    });
  }
}
