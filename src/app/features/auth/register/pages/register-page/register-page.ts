import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

import {MatError, MatFormField, MatLabel,} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

import {AuthService} from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly successMessageKey = signal<string | null>(null);
  readonly errorMessageKey = signal<string | null>(null);

  readonly registerForm = new FormGroup({
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessageKey.set(null);
    this.successMessageKey.set(null);

    this.authService
      .register(this.registerForm.getRawValue())
      .subscribe({
        next: () => {
          this.successMessageKey.set('auth.register.success');

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },

        error: error => {
          const errorCode = error.error?.code;

          if (errorCode) {
            this.errorMessageKey.set(`errors.${errorCode}`);
            return;
          }

          if (error.status === 0) {
            this.errorMessageKey.set('auth.errors.network');
            return;
          }

          this.errorMessageKey.set('auth.errors.unknown');
        },
      });
  }
}
