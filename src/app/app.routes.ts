import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    pathMatch: 'full'
  },
  {
    path: 'translate',
    loadComponent: () => import('./translate/translate.component').then(m => m.TranslateComponent)
  }
];
