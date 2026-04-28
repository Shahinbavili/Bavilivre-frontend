import {Component, inject, signal} from '@angular/core';
import {BookService} from '../../../core/services/book';
import {ActivatedRoute} from '@angular/router';
import {KeyValuePipe} from '@angular/common';

@Component({
  selector: 'app-lent-books',
  imports: [KeyValuePipe],
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
      console.log('lentBooks signal:', this.lentBooks());
      this.lentBooks.set(dto.lentBookList);
    })
  }
}
