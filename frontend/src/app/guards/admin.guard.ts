import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const user = auth.getCurrentUser();
  if (user && (user.role === 'ADMIN')) {
    return true;
  }

  // Redirect with error param so the destination component can show the toast
  return router.parseUrl('/feed?error=unauthorized');
};
