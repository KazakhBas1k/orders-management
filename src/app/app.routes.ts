import { Routes } from '@angular/router';
import { login_page } from '@auth/constants';
import { authGuard } from '@auth/guards';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./features/orders.route').then((r) => r.orders_route),
  },
  {
    path: login_page,
    loadComponent: () => import('./auth/pages').then((c) => c.LoginComponent),
  },
];
