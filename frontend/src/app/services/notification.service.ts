import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);

  showSuccess(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    }
  }

  showError(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.snackBar.open(message, 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }
}
