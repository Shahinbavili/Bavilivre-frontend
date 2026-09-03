import {Component, effect, input, output} from '@angular/core';
import {BookFormModel} from '../../../../core/models/book-form.model';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatHint, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-book-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatInput,
    MatHint
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.scss',
})
export class BookForm {
  readonly initialValue = input<BookFormModel | null>(null);
  readonly submitLabel = input.required<string>();
  readonly submitting = input(false);
  readonly submitted = output<BookFormModel>();
  readonly showCancel = input(false);
  readonly cancelled = output<void>();

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

  constructor() {
    effect(() => {
      const value = this.initialValue();

      if (value) {
        this.form.patchValue(value);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }
}
