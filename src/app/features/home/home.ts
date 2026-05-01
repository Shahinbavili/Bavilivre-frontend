import {Component, inject} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslatePipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  private translate = inject(TranslateService);

  setLang(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

}
