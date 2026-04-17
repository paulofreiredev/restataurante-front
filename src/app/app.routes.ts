import { Routes } from '@angular/router';
import { Home as ClientHome } from './client/home/home';
import { Checkout } from './client/checkout/checkout';
import { OrderStatus } from './client/order-status/order-status';

export const routes: Routes = [
    {
        path: 'client/home',
        component: ClientHome
    },
    {
        path: 'client/checkout',
        component: Checkout
    },
    {
        path: 'client/order-status',
        component: OrderStatus
    },
    {
        path: '**',
        redirectTo: 'client/home'
    }
];
