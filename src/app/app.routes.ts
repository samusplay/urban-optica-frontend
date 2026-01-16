import { Routes } from '@angular/router';
import { PublicLayout } from './theme/public-layout/public-layout';
import { AuthLayout } from './theme/auth-layout/auth-layout';
export const routes: Routes = [
   {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
      { path: 'catalogo', loadComponent: () => import('./pages/catalogo/catalogo').then(m => m.CatalogoComponent) },
      { path: 'producto/:id', loadComponent: () => import('./pages/producto/producto').then(m => m.ProductoComponent) },
      
    ],
  },
  {
    path: 'auth',  // ← Nueva ruta padre para auth
    component: AuthLayout, //envuelve todo el Layout los componentes
    children: [
      { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }  // Redirige /auth a login por default

    ]
  },
  { path: '**', redirectTo: '' },
];
