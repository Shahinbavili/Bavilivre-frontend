import {Component, inject, OnInit, signal} from '@angular/core';
import {BookService} from '../../../core/services/book';
import {ActivatedRoute} from '@angular/router';
import {KeyValuePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {LentBooksDto} from '../../../core/dto/lent-books.dto';

@Component({
  selector: 'app-lent-books',
  standalone: true,
  imports: [KeyValuePipe, TranslatePipe],
  templateUrl: './lent-books.html',
  styleUrl: './lent-books.scss',
})
export class LentBooks implements OnInit {

  private readonly bookService = inject(BookService);
  private readonly route = inject(ActivatedRoute);

  readonly lentBooks = signal<Record<number, number>>({});

  ngOnInit(): void {

    const userId = Number(this.route.snapshot.paramMap.get('id'));

    this.bookService.getLentBooks(userId).subscribe({
      next: (dto: LentBooksDto) => {
        this.lentBooks.set(dto.lentBookList);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
