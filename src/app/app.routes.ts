import { Routes } from '@angular/router';
import { Home as ClientHome } from './client/home/home';
import { Checkout } from './client/checkout/checkout';
import { OrderStatus } from './client/order-status/order-status';
import { AdminLogin } from './admin/login/login';
import { AdminProducts } from './admin/products/products';
import { AdminOrders } from './admin/orders/orders';
import { adminAuthGuard } from './admin/guards/admin-auth.guard';

export const routes: Routes = [
  { path: 'client/home',         component: ClientHome },
  { path: 'client/checkout',     component: Checkout },
  { path: 'client/order-status', component: OrderStatus },
  { path: 'admin/login',         component: AdminLogin },
  { path: 'admin/products',      component: AdminProducts, canActivate: [adminAuthGuard] },
  { path: 'admin/orders',        component: AdminOrders,   canActivate: [adminAuthGuard] },
  { path: 'admin',               redirectTo: 'admin/products', pathMatch: 'full' },
  { path: '**',                  redirectTo: 'client/home' },
];
