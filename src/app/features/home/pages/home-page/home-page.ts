import {Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    TranslatePipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {

  private readonly authService = inject(AuthService);
}
