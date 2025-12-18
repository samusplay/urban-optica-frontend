import { Routes } from '@angular/router';
import { PublicLayout } from './theme/public-layout/public-layout';

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
  { path: '**', redirectTo: '' },
];
