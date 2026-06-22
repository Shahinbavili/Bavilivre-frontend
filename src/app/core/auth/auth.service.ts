import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthenticationResponse, LoginRequest, RegisterRequest,} from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private readonly tokenStorageKey = 'bavilivre_jwt';

  readonly isAuthenticated = signal(false);

  constructor() {
    this.loadStoredToken();
  }

  login(request: LoginRequest): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          this.storeToken(response.token);
          this.isAuthenticated.set(true);
        })
      );
  }

  register(request: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  private loadStoredToken() {
    const token = localStorage.getItem(this.tokenStorageKey);

    if (token) {
      this.isAuthenticated.set(true);
    }
  }
}
