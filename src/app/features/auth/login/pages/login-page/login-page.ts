import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../../core/auth/auth.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {Router} from '@angular/router';

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

  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
      updateOn: 'blur',
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: 'blur',
    }),
  });

  onSubmit(): void {
    this.errorMessageKey.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.authService.loadCurrentUser().subscribe({
            next: () => this.router.navigate(['/']),
          }
        );
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
    })
  }
}
