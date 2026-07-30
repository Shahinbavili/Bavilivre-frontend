import {Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, finalize, Subject} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

import {Book} from '../../../../../core/models/book.model';
import {BookService} from '../../../../../core/services/book.service';
import {BookCard} from '../../../components/book-card/book-card';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-book-catalog-page',
  imports: [BookCard, TranslatePipe],
  templateUrl: './book-catalog-page.html',
  styleUrl: './book-catalog-page.scss',
})
export class BookCatalogPage implements OnInit {
  private readonly bookService = inject(BookService);

  // Provides the component destruction lifecycle to RxJS operators.
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchChanges = new Subject<string>();

  readonly books = signal<Book[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  readonly searchTitle = signal('');
  readonly selectedLanguage = signal('');
  readonly selectedCategory = signal('');
  readonly availableOnly = signal(false);
  readonly selectedSort = signal('-createdAt');

  // Gives direct access to the search input to reset its value programmatically.
  @ViewChild('searchInput')
  private searchInput?: ElementRef<HTMLInputElement>;

  readonly hasActiveCriteria = computed(() =>
    this.searchTitle().trim() !== '' ||
    this.selectedLanguage() !== '' ||
    this.selectedCategory() !== '' ||
    this.availableOnly() ||
    this.selectedSort() !== '-createdAt'
  );


  ngOnInit(): void {
    this.searchChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        // Automatically unsubscribes when the component is destroyed.
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(title => {
        this.searchTitle.set(title);
        this.loadBooks();
      });

    this.loadBooks();
  }

  private loadBooks(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.bookService.getBooks({
      title: this.searchTitle(),
      language: this.selectedLanguage(),
      category: this.selectedCategory(),
      available: this.availableOnly() ? true : undefined,
      sort: this.selectedSort(),
    })
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: response => {
          this.books.set(response.content);
        },
        error: error => {
          console.error('Failed to load books', error);
          this.loadError.set(true);
        },
      });
  }

  protected onSortChange(sort: string): void {
    this.selectedSort.set(sort);
    this.loadBooks();
  }

  protected onSearchChange(title: string): void {
    this.searchChanges.next(title.trim());
  }

  protected onLanguageChange(language: string): void {
    this.selectedLanguage.set(language);
    this.loadBooks();
  }

  protected onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
    this.loadBooks();
  }

  protected onAvailabilityChange(available: boolean): void {
    this.availableOnly.set(available);
    this.loadBooks();
  }

  resetFilters(): void {
    this.searchTitle.set('');
    this.selectedLanguage.set('');
    this.selectedCategory.set('');
    this.availableOnly.set(false);
    this.selectedSort.set('-createdAt');

    // Allows updating the native input value when resetting filters.
    // The input is intentionally not bound with [value] to preserve smooth typing with debounce.
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }

    this.loadBooks();
  }
}
