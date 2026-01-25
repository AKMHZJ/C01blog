import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  theme = inject(ThemeService);
  private notificationService = inject(NotificationService);

  get isDark() {
    return this.theme.isDark();
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  handleSubmit() {
    if (this.loginForm.invalid) {
      this.notificationService.showError('Please fill in all required fields');
      return;
    }

    const credentials = this.loginForm.value;

    console.log('Sending to backend:', credentials);

    if (isPlatformBrowser(this.platformId)) {
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful!', response);
          if (!response || !response.token) {
            this.notificationService.showError('Invalid response from server');
            return;
          }
          this.notificationService.showSuccess('Welcome back!');
          this.router.navigate(['/feed']);
        },
        error: (err) => {
          console.error('Login error:', err);
          const msg = err.status === 401 ? 'Invalid username or password' : 'Login failed';
          this.notificationService.showError(msg);
        },
      });
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  toggleTheme() {
    this.theme.toggle();
  }
}
