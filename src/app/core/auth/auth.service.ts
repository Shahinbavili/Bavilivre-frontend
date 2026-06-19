import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthenticationResponse, LoginRequest, RegisterRequest,} from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;

  readonly isAuthenticated = signal(false);

  login(request: LoginRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${this.apiUrl}/login`,
      request,
    );
  }

  register(request: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${this.apiUrl}/register`,
      request,
    )
  }

  logout(): void {
    this.isAuthenticated.set(false);
  }

}
