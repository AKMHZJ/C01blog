import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  isDark = true;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['', [Validators.required]]
    });
  }

  handleSubmit() {
    if (this.signupForm.invalid) {
      this.notificationService.showError('Please fix the errors in the form');
      return;
    }

    const user = {
      ...this.signupForm.value,
      bio: '',
      avatar: ''
    };

    if (isPlatformBrowser(this.platformId)) {
      this.authService.signup(user).subscribe({
        next: (response) => {
          console.log('Signup Successful:', response);
          this.notificationService.showSuccess('Signup successful! Please log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Signup Failed:', err);
          const msg = typeof err.error === 'string' ? err.error : 'Signup failed. Please try again.';
          this.notificationService.showError(msg);
        }
      });
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
  }
}
