import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ToastService } from '@shared/services/toast.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService: ToastService = inject(ToastService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (`${error.status}`.startsWith('4') || `${error.status}`.startsWith('5')) {
        toastService.add('Ошибка', error.message, 'error');
      }
      return throwError(() => error);
    }),
  );
};
