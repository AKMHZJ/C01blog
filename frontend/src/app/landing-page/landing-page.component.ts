import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, OnDestroy, AfterViewInit {
  scrollY = 0;
  currentWordIndex = 0;
  animatingOut = false;
  words = ['writers', 'thinkers', 'creators', 'students', 'learners'];

  private wordInterval: any;
  private wordSwapTimeout: any;
  private observer: IntersectionObserver | null = null;
  public theme = inject(ThemeService);

  get isDark() {
    return this.theme.isDark();
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.wordInterval = setInterval(() => this.rotateWord(), 2500);
    }
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }

  private rotateWord() {
    // Fade out, swap, then fade in to avoid abrupt layout shifts
    this.animatingOut = true;
    this.wordSwapTimeout = setTimeout(() => {
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      this.animatingOut = false;
    }, 420);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy() {
    if (this.wordInterval) {
      clearInterval(this.wordInterval);
    }
    if (this.wordSwapTimeout) {
      clearTimeout(this.wordSwapTimeout);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollY = window.scrollY;
    }
  }

  toggleTheme() {
    this.theme.toggle();
  }

  onContinue() {
    // console.log('Navigate to Login/App...');
    this.router.navigate(['/login']);
    // Add your navigation logic here
    // Example: this.router.navigate(['/login']);
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-up');
    elements.forEach((el) => this.observer?.observe(el));
  }
}
