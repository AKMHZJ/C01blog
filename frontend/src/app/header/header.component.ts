import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { NotificationApiService } from '../services/notification-api.service';
import { Notification } from '../models/notification';

import { ImageUrlPipe } from '../pipes/image-url.pipe';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ImageUrlPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private router = inject(Router);
  public theme = inject(ThemeService);
  private notificationService = inject(NotificationApiService);

  notifications: Notification[] = [];
  showNotifications = false;
  pollingSub: Subscription | null = null;

  get user() {
    return this.authService.currentUser();
  }

  get isDark() {
    return this.theme.isDark();
  }

  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  isMobileMenuOpen = false;

  constructor() {}

  ngOnInit() {
    if (this.user) {
      this.loadNotifications();
      // Poll every 30 seconds
      this.pollingSub = interval(30000).subscribe(() => this.loadNotifications());
    }
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: (e) => console.error('Failed to load notifications', e)
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  markAsRead(n: Notification) {
    if (!n.read) {
      this.notificationService.markAsRead(n.id).subscribe({
        next: (updated) => {
          n.read = true;
        }
      });
    }
    // Navigate if relatedId exists
    if (n.relatedId) {
      this.router.navigate(['/post', n.relatedId]);
      this.showNotifications = false;
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  onLogoClick(event: Event) {
    event.preventDefault();
    if (this.user) {
      if (this.router.url === '/feed') {
        window.location.reload();
      } else {
        this.router.navigate(['/feed']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    this.theme.toggle();
  }
}
