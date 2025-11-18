import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import { token_cookie } from '@auth/constants';

export const authGuard: CanActivateFn = async (route, state) => {
  const cookiesService: CookieService = inject(CookieService);
  const router = inject(Router);
  if (cookiesService.check(token_cookie)) {
    return true;
  } else {
    await router.navigate(['login']);
    return false;
  }
};
