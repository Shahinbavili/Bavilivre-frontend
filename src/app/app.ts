import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppLayout} from './shared/layout/app-layout/app-layout';
import {AuthService} from './core/auth/auth.service';
import {Dir} from '@angular/cdk/bidi';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AppLayout,
    Dir
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('bavilivre-frontend');
  protected readonly direction = signal<'ltr' | 'rtl'>('ltr');

  private translate = inject(TranslateService);
  private readonly authService = inject(AuthService);

  private supportedLanguages = ['fr', 'en', 'de', 'fa'];


  constructor() {
    this.translate.addLangs(this.supportedLanguages);
    this.translate.setFallbackLang('fr');

    const savedLang = localStorage.getItem('lang');
    const browserLang = this.translate.getBrowserLang();

    const selectedLang =
      savedLang && this.supportedLanguages.includes(savedLang)
        ? savedLang
        : this.supportedLanguages.includes(browserLang ?? '')
          ? browserLang!
          : 'fr';

    this.translate.use(selectedLang);
    this.updateDirection(selectedLang);

    this.translate.onLangChange.subscribe(event => {
      this.updateDirection(event.lang);
    });

    if (this.authService.isAuthenticated()) {
      this.authService.loadCurrentUser().subscribe({
        error: () => this.authService.logout(),
      });
    }
  }

  private updateDirection(lang: string): void {
    const direction: 'ltr' | 'rtl' = lang === 'fa' ? 'rtl' : 'ltr';

    this.direction.set(direction);

    document.documentElement.dir = direction;
    document.documentElement.lang = lang;
  }
}
