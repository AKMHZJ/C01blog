import { Injectable, Inject, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  isDark = signal<boolean>(true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.storageKey);
      if (stored === 'light') this.isDark.set(false);
      else if (stored === 'dark') this.isDark.set(true);
    }

    // Perspective: sync to localStorage whenever the signal changes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.storageKey, this.isDark() ? 'dark' : 'light');
      }
    });
  }

  toggle() {
    this.isDark.update(v => !v);
  }
}
