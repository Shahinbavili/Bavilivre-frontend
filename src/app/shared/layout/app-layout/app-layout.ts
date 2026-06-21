import {Component} from '@angular/core';
import {Header} from '../header/header/header';
import {RouterOutlet} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-app-layout',
  imports: [
    Header,
    RouterOutlet,
    TranslatePipe
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {
}
