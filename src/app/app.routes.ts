import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/posts/pages/dashboard/dashboard')
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
