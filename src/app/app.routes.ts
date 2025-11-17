import { Routes } from '@angular/router';
import { login_page } from '@auth/constants';

export const routes: Routes = [
  {
    path: login_page,
    loadComponent: () => import('./auth/pages').then((c) => c.LoginComponent),
  },
];
