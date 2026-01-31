import { Component, OnInit, inject, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { NotificationService } from '../services/notification.service';
import { Post } from '../models/post';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BlogCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  feedPosts: Post[] = [];
  feedLoaded = false;
  showEmptyRequested = false;
  
  page = 0;
  size = 5;
  hasMore = true;
  isLoading = false;
  
  private navSub: Subscription | null = null;

  private router = inject(Router);
  private postService = inject(PostService);
  public authService = inject(AuthService);
  private theme = inject(ThemeService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);

  // Create observable in injection context (field initializer)
  private loggedIn$ = toObservable(this.authService.loggedIn);

  get isDark() {
    return this.theme.isDark();
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  onPostClick(postId: string) {
    this.router.navigate(['/post', postId]);
  }

  ngOnInit() {
    // 1. Handle unauthorized error toast independently
    this.route.queryParamMap.subscribe(params => {
      if (params.get('error') === 'unauthorized') {
        // Show the toast
        this.notificationService.showError('Unauthorized access: Admin privileges required.');
        
        // Clear the query param so it doesn't show again on reload
        setTimeout(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { error: null },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
        }, 100);
      }
    });

    // 2. React to query params and auth state for feed loading
    combineLatest([this.route.queryParamMap, this.loggedIn$]).subscribe(([params, isLoggedIn]) => {
      this.showEmptyRequested = params.has('showEmpty');
      this.loadFeed(isLoggedIn);
    });
    
    // 3. Listen for navigation events (reload on same URL)
    this.navSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
       if (this.authService.isLoggedIn()) {
         this.loadFeed(true);
       }
    });
  }

  ngOnDestroy() {
    if (this.navSub) this.navSub.unsubscribe();
  }

  loadFeed(isLoggedIn: boolean) {
    this.feedLoaded = false;
    this.feedPosts = [];
    this.page = 0;
    this.hasMore = true;
    
    if (!isLoggedIn) {
      setTimeout(() => {
        this.feedLoaded = true;
        this.cdr.markForCheck();
      }, 0);
      return;
    }

    this.fetchPosts();
  }

  fetchPosts() {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;

    this.postService.getFeed(this.page, this.size).subscribe({
      next: (pageData) => {
        // Defer state update to avoid NG0100
        setTimeout(() => {
          const newPosts = pageData.content || [];
          this.feedPosts = [...this.feedPosts, ...newPosts];
          this.hasMore = !pageData.last;
          this.page++;
          
          this.isLoading = false;
          this.feedLoaded = true;
          if (this.feedPosts.length > 0) this.showEmptyRequested = false;
          this.cdr.markForCheck();
        }, 0);
      },
      error: (err) => {
        console.error('[Home] failed to load feed', err);
        setTimeout(() => {
          this.isLoading = false;
          this.feedLoaded = true;
          this.cdr.markForCheck();
        }, 0);
      },
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
      this.fetchPosts();
    }
  }

  goToDiscover(event: Event) {
    event.preventDefault();
    this.router.navigateByUrl('/discover');
  }

  logout() {
    this.authService.logout();
  }
}
