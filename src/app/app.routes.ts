import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./routes/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'search',
        loadComponent: () => import('./routes/results.component').then(m => m.ResultsComponent),
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
