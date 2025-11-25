import { Routes } from '@angular/router';
import { login_page } from '@auth/constants';
import { authGuard } from '@auth/guards';
import { LoginComponent } from '@auth/pages';

export const routes: Routes = [
  {
    path: login_page,
    component: LoginComponent,
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./features/orders.route').then((r) => r.orders_route),
  },
  { path: '**', redirectTo: '' },
];
