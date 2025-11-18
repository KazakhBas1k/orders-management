import { HttpInterceptorFn } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import { token_cookie } from '@auth/constants';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService: CookieService = inject(CookieService);
  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${cookieService.get(token_cookie)}`,
      },
    }),
  );
};
