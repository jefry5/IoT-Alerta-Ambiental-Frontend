import { Routes } from '@angular/router';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () => AuthModule,
    },
    {
        path: 'dashboard',
        loadChildren: () => DashboardModule,
    },
    {
        path: '**',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];
