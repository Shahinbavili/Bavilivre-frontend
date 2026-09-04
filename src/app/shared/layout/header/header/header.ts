import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatMenu, MatMenuItem, MatMenuTrigger,} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';

import {AuthService} from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    TranslatePipe,
    RouterLink,
    MatMenuTrigger,
    MatMenuItem,
    MatIcon,
    MatMenu,
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

    const direction = lang === 'fa' ? 'rtl' : 'ltr';

    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
  }

  displayName(name: string): string {
    if (!name) {
      return '';
    }

    return name.charAt(0).toLocaleUpperCase() + name.slice(1);
  }

  logout(): void {
    this.authService.logout();
  }
}
