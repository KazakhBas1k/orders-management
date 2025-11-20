import { Routes } from '@angular/router';

export const orders_route: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./orders/pages/orders/orders.component').then((c) => c.OrdersComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./orders/pages/order-info/order-info').then((c) => c.OrderInfo),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./orders/pages/order-create/order-create').then((c) => c.OrderCreate),
  },
];
