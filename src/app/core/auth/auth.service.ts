import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthenticationResponse, LoginRequest, RegisterRequest, UserDto,} from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private readonly tokenStorageKey = 'bavilivre_jwt';

  readonly isAuthenticated = signal(false);
  readonly currentUser = signal<UserDto | null>(null);

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
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  private loadStoredToken() {
    const token = localStorage.getItem(this.tokenStorageKey);

    if (!token) {
      return;
    }

    this.isAuthenticated.set(true);

    this.loadCurrentUser().subscribe({
      error: () => {
        this.logout();
      }
    });
  }

  loadCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
      })
    );
  }
}
