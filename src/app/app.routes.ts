import { Routes } from '@angular/router';
import { login_page } from '@auth/constants';
import { authGuard } from '@auth/guards';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/orders/pages/orders/orders.component').then((c) => c.OrdersComponent),
  },
  {
    path: login_page,
    loadComponent: () => import('./auth/pages').then((c) => c.LoginComponent),
  },
];
