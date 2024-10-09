import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    console.log(`👁️‍🗨️ Auth guard: FALSE`);
    router.navigate(['/login']);
    return false;
  }
  console.log(`👁️‍🗨️ Auth guard: TRUE`);
  return true;
};
