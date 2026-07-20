import {Component, input, output} from '@angular/core';
import {BookFormModel} from '../../../../core/models/book-form.model';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-book-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.scss',
})
export class BookForm {
  readonly submitLabel = input.required<string>();
  readonly submitting = input(false);
  readonly submitted = output<BookFormModel>();

  private readonly formBuilder = new FormBuilder();

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(255)
    ]],
    author: ['', [
      Validators.required,
      Validators.maxLength(255)
    ]],
    description: ['', [
      Validators.required,
      Validators.maxLength(2000)
    ]],
    language: ['', [
      Validators.required
    ]],
    category: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }
}
