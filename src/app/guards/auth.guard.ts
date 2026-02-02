import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../pages/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // NOTA: Usamos .isSessionActive sin paréntesis porque es un 'get'
  if (authService.isSessionActive) {
    return true;
  } else {
    router.navigate(['/login']); 
    return false;
  }
};
