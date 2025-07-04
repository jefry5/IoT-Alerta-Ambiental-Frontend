import { Routes } from '@angular/router';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { isNotLoggedGuard } from './core/guards/is-not-logged.guard';
import { isLoggedGuard } from './core/guards/is-logged.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () => AuthModule,
        canActivate: [isNotLoggedGuard],
    },
    {
        path: 'dashboard',
        loadChildren: () => DashboardModule,
        canActivate: [isLoggedGuard],
    },
    {
        path: '**',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];
