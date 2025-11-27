import { Routes } from '@angular/router';

export const orders_route: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./orders/pages/orders/orders.component').then((c) => c.OrdersComponent),
  },

  {
    path: 'create',
    loadComponent: () =>
      import('./orders/pages/order-create/order-create.component').then(
        (c) => c.OrderCreateComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./orders/pages/order-info/order-edit.component').then((c) => c.OrderEdit),
  },
];
