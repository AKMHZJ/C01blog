import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { Post } from '../models/post';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BlogCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  feedPosts: Post[] = [];
  feedLoaded = false;
  showEmptyRequested = false;

  private router = inject(Router);
  private postService = inject(PostService);
  public authService = inject(AuthService);
  private theme = inject(ThemeService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

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
    // React to both query params AND auth state changes
    combineLatest([this.route.queryParamMap, this.loggedIn$]).subscribe(([params, isLoggedIn]) => {
      this.showEmptyRequested = params.has('showEmpty');
      this.loadFeed(isLoggedIn);
    });
  }

  loadFeed(isLoggedIn: boolean) {
    this.feedLoaded = false;
    
    if (!isLoggedIn) {
      setTimeout(() => {
        this.feedPosts = [];
        this.feedLoaded = true;
        this.cdr.markForCheck();
      }, 0);
      return;
    }

    this.postService.getFeed().subscribe({
      next: (posts) => {
        // Defer state update to avoid NG0100 (ExpressionChangedAfterItHasBeenCheckedError)
        setTimeout(() => {
          this.feedPosts = posts || [];
          this.feedLoaded = true;
          if (this.feedPosts.length > 0) this.showEmptyRequested = false;
          this.cdr.markForCheck();
        }, 0);
      },
      error: (err) => {
        console.error('[Home] failed to load feed', err);
        setTimeout(() => {
          this.feedLoaded = true;
          this.cdr.markForCheck();
        }, 0);
      },
    });
  }

  goToDiscover(event: Event) {
    event.preventDefault();
    this.router.navigateByUrl('/discover');
  }

  logout() {
    this.authService.logout();
  }
}
