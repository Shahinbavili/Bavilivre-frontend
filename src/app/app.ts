import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppLayout} from './shared/layout/app-layout/app-layout';
import {AuthService} from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('bavilivre-frontend');

  private translate = inject(TranslateService);
  private supportedLangs = ['fr', 'en', 'de', 'fa'];

  private readonly authService = inject(AuthService);

  constructor() {
    this.translate.addLangs(this.supportedLangs);
    this.translate.setFallbackLang('fr');

    const savedLang = localStorage.getItem('lang');
    const browserLang = this.translate.getBrowserLang();

    const selectedLang =
      savedLang && this.supportedLangs.includes(savedLang)
        ? savedLang
        : this.supportedLangs.includes(browserLang ?? '')
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
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
}
