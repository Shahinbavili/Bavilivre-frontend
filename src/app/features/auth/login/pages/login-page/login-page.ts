import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../../core/auth/auth.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {

  private readonly authService = inject(AuthService);
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
        this.authService.loadCurrentUser().subscribe();
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
