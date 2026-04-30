import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('bavilivre-frontend');

  private translate = inject(TranslateService);

  constructor() {

    this.translate.addLangs(['fr', 'en', 'de']);

    this.translate.setFallbackLang('fr');

    const browserLang = this.translate.getBrowserLang();

    this.translate.use(
      ['fr', 'en', 'de'].includes(browserLang ?? '')
        ? browserLang!
        : 'fr'
    );
  }
}
