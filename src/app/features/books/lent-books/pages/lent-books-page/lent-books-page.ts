import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {BookService} from '../../../../../core/services/book.service';
import {ActivatedRoute} from '@angular/router';
import {KeyValuePipe} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LentBooksDto} from '../../../../../core/dto/lent-books.dto';

@Component({
  selector: 'app-lent-books-page',
  standalone: true,
  imports: [KeyValuePipe, TranslatePipe],
  templateUrl: './lent-books-page.html',
  styleUrl: './lent-books-page.scss',
})
export class LentBooksPage implements OnInit {

  private readonly bookService = inject(BookService);
  private readonly route = inject(ActivatedRoute);
  protected readonly translate = inject(TranslateService);
  readonly lentBooks = signal<Record<number, number>>({});

  readonly lentBooksEntries = computed(() =>
    Object.entries(this.lentBooks())
      .map(([bookId, borrowerId]) => ({
        bookId: Number(bookId),
        borrowerId
      }))
  );

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

  lentBookLabel(entry: { bookId: number, borrowerId: number }): string {
    return this.translate.instant('books.lent.item', {
      bookId: entry.bookId,
      borrowerId: entry.borrowerId,
    })
  }
}
