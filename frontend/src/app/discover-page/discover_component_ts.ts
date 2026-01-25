import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UserService, UserSummary } from '../services/user.service';
import { ThemeService } from '../services/theme.service';
import { ImageUrlPipe } from '../pipes/image-url.pipe';

@Component({
  selector: 'app-discover-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, ImageUrlPipe],
  templateUrl: './discover_component_html.html',
  styleUrls: ['./discover_component_css.scss']
})
export class DiscoverPageComponent implements OnInit {
  users: UserSummary[] = [];
  subscriptions: string[] = [];
  currentUserId: string = '';

  private router = inject(Router);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  public theme = inject(ThemeService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get isDark() {
    return this.theme.isDark();
  }

  ngOnInit() {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        if (ev.urlAfterRedirects && ev.urlAfterRedirects.indexOf('/discover') !== -1) {
          this.loadData();
        }
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          this.currentUserId = u.id || '';
        } catch (e) {
          this.currentUserId = '';
        }
      }
    }

    this.loadData();
  }

  loadData() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('[Discover] Failed to load users', err)
    });

    this.userService.getMyFollowing().subscribe({
      next: (ids) => {
        this.subscriptions = ids || [];
        this.cdr.detectChanges();
      },
      error: () => {
        if (isPlatformBrowser(this.platformId)) {
          try {
            const subs = localStorage.getItem('subscriptions');
            this.subscriptions = subs ? JSON.parse(subs) : [];
          } catch (e) { this.subscriptions = []; }
        }
      }
    });
  }

  getUserPostCount(userId: string): number {
    const u = this.users.find(x => x.id === userId);
    return u && u.postCount ? u.postCount : 0;
  }

  isSubscribed(userId: string): boolean {
    return this.subscriptions.includes(userId);
  }

  handleToggleSubscribe(userId: string, event: Event) {
    event.stopPropagation();
    this.userService.follow(userId).subscribe({
      next: (res) => {
        const following = res && res.following === true;
        if (following) {
          this.subscriptions = Array.from(new Set([...this.subscriptions, userId]));
        } else {
          this.subscriptions = this.subscriptions.filter(id => id !== userId);
        }
        if (isPlatformBrowser(this.platformId)) {
          try { localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions)); } catch (e) { /* ignore */ }
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('[Discover] follow toggle failed', err)
    });
  }

  onUserClick(user: UserSummary) {
    // Optionally navigate to user profile
    console.log('User clicked:', user);
  }
}
