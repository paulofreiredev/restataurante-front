import { Routes } from '@angular/router';
import { Home as ClientHome } from './client/home/home';
import { Checkout } from './client/checkout/checkout';

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
        path: '**',
        redirectTo: 'client/home'
    }
];
