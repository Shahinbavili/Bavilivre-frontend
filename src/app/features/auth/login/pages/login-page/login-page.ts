import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../../core/auth/auth.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {Router} from '@angular/router';
import {finalize, switchMap} from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatFormField,
    MatLabel,
    MatError,
    MatInput
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly errorMessageKey = signal<string | null>(null);

  readonly submitting = signal(false);

  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit(): void {
    // Prevent duplicate submissions while the login request is in progress.
    if (this.submitting()) {
      return;
    }

    this.errorMessageKey.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(
        switchMap(() => this.authService.loadCurrentUser()),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: () => {
          // Redirect to the home page; the navigation result is not needed here.
          void this.router.navigate(['/']);
        },

        error: error => {
          if (error.status === 401) {
            this.errorMessageKey.set('auth.errors.invalidCredentials');
            return;
          }

          if (error.status === 0) {
            this.errorMessageKey.set('auth.errors.network');
            return;
          }

          this.errorMessageKey.set('auth.errors.unknown');
        }
      });
  }
}
