import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Header} from './shared/layout/header/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('bavilivre-frontend');

  private translate = inject(TranslateService);
  private supportedLangs = ['fr', 'en', 'de', 'fa'];

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
  }

  private updateDirection(lang: string): void {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
}
