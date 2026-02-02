import { Routes } from '@angular/router';
import { AuthLayout } from './theme/auth-layout/auth-layout';
import { ProfileLayoutComponent } from './theme/profile-layout/profile-layout.component';
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
  {
    path: 'auth',  // ← Nueva ruta padre para auth
    component: AuthLayout, //envuelve todo el Layout los componentes
    children: [
      { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }  // Redirige /auth a login por default

    ]
  },
  {
    path:'dashboard',
    component:ProfileLayoutComponent,
    children:[
      {path:'profile',loadComponent:()=>import('./pages/profile-user/profile-user.component').then(m=>m.ProfileUserComponent)},
      {path:'pedidos',loadComponent:()=>import('./pages/pedidos/pedidos.component').then(m=>m.PedidosComponent)},
      {path:'formulas',loadComponent:()=>import('./pages/formulas/formulas.component').then(m=>m.FormulasComponent)},
      {path:'pagos',loadComponent:()=>import('./pages/pagos/pagos.component').then(m=>m.PagosComponent)},

    ]
  },

  { path: '**', redirectTo: '' },
];
