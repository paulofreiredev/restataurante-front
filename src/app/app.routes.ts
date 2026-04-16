import { Routes } from '@angular/router';
import { Home as ClientHome } from './client/home/home';
export const routes: Routes = [
    {
        path: 'client/home',
        component: ClientHome
    }
];
