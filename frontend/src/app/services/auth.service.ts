import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  loggedIn = signal<boolean>(false);
  currentUser = signal<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize state from localStorage only in the browser
    if (isPlatformBrowser(this.platformId)) {
      const user = this.loadUserFromStorage();
      const token = localStorage.getItem('token');
      
      if (this.isValidToken(token)) {
        if (user) {
          this.currentUser.set(user);
          this.loggedIn.set(true);
        }
        
        // Always refresh from server to ensure state is current and verified
        this.refreshUser();
      }
    }
  }

  private refreshUser() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    this.http.get('http://localhost:8080/api/users/me', { headers }).subscribe({
      next: (user: any) => {
        if (user) {
          // Sync storage and signals
          const mappedUser = {
            id: user.id,
            username: user.username,
            displayName: user.displayName || user.username,
            bio: user.bio || '',
            avatar: user.avatar || '',
            email: user.email || '',
            role: user.role || 'USER',
          };
          localStorage.setItem('currentUser', JSON.stringify(mappedUser));
          
          // Defer signal update to avoid NG0100 during initialization
          setTimeout(() => {
            this.currentUser.set(mappedUser);
            this.loggedIn.set(true);
          }, 0);
        }
      },
      error: (err) => {
        console.error('Session verification failed:', err);
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
      }
    });
  }

  private isValidToken(token: string | null): token is string {
    return !!token && token !== 'undefined' && token !== 'null' && token.trim().length > 0;
  }

  private loadUserFromStorage() {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData).pipe(
      tap((response: any) => {
        this.saveUser(response);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        this.saveUser(response);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('username');
    }
    this.loggedIn.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  saveUser(data: any) {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = data?.token;
    if (this.isValidToken(token)) {
      localStorage.setItem('token', token);
      this.loggedIn.set(true);
    } else {
      localStorage.removeItem('token');
      this.loggedIn.set(false);
    }

    const username = data?.username;
    if (typeof username === 'string' && username.trim().length > 0) {
      const user = {
        id: data?.id || data?.userId || '',
        username,
        displayName: data?.displayName || username,
        bio: data?.bio || '',
        avatar: data?.avatar || '',
        email: data?.email || '',
        role: data?.role || 'USER',
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('username', username);
      this.currentUser.set(user);
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('username');
      this.currentUser.set(null);
    }
  }

  getCurrentUser() {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }
}
