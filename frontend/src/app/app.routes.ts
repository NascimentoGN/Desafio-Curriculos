import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'cadastro', pathMatch: 'full' },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./features/cadastro/cadastro.component').then((m) => m.CadastroComponent)
  },
  {
    path: 'candidatos',
    loadComponent: () =>
      import('./features/lista/lista.component').then((m) => m.ListaComponent)
  },
  {
    path: 'candidatos/:id',
    loadComponent: () =>
      import('./features/detalhe/detalhe.component').then((m) => m.DetalheComponent)
  },
  { path: '**', redirectTo: 'cadastro' }
];