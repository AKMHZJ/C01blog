import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

import { ImageUrlPipe } from '../pipes/image-url.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ImageUrlPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);
  public theme = inject(ThemeService);

  get user() {
    return this.authService.currentUser();
  }

  get isDark() {
    return this.theme.isDark();
  }

  constructor() {}

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    this.theme.toggle();
  }
}
