import {Component, inject} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly translate = inject(TranslateService);
  protected readonly authService = inject(AuthService);

  readonly languages = ['fr', 'en', 'de', 'fa'];

  get currentLang(): string {
    return this.translate.getCurrentLang() || 'fr';
  }

  setLang(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  logout(): void {
    this.authService.logout();
  }
}
