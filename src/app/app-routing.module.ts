import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioGuard } from './guards/usuario.guard';

const routes: Routes = [
  {
    path: 'main',
    loadChildren: () => import('./pages/visitas/visitas.module').then( m => m.VisitasPageModule),
    canLoad: [ UsuarioGuard ]
  },
  {
    path: '',
    redirectTo: 'visitas',
    pathMatch: 'full'
  },
  {
    path: 'login', //NO HAY LOGOUT PORQUE AL BORRAR EL STORAGE QUEDA SIN JWT
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'visitas',
    loadChildren: () => import('./pages/visitas/visitas.module').then( m => m.VisitasPageModule),
    // canActivate: [ UsuarioGuard ]
    canLoad: [ UsuarioGuard ]
  },
  {
    path: 'update-visita',
    loadChildren: () => import('./pages/update-visita/update-visita.module').then( m => m.UpdateVisitaPageModule),
    // canActivate: [ UsuarioGuard ]
    canLoad: [ UsuarioGuard ]
  },
  {
    path: 'items-visita/:id',
    loadChildren: () => import('./pages/items-visita/items-visita.module').then( m => m.ItemsVisitaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
