import {Component, inject, signal} from '@angular/core';
import {BookService} from '../../../core/services/book';
import {ActivatedRoute} from '@angular/router';
import {KeyValuePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-lent-books',
  imports: [KeyValuePipe, TranslatePipe],
  templateUrl: './lent-books.html',
  styleUrl: './lent-books.scss',
})
export class LentBooks {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);

  lentBooks = signal<Record<number, number>>({});

  ngOnInit() {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    this.bookService.getLentBooks(userId).subscribe(dto => {
      this.lentBooks.set(dto.lentBookList);
    })
  }
}
