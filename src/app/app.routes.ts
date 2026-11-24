import { Routes } from '@angular/router';
import { ListagemComponent } from './components/listagem/listagem.component';
import { FormularioComponent } from './components/formulario/formulario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'reservas', pathMatch: 'full' },
  { path: 'reservas', component: ListagemComponent },
  { path: 'reservas/novo', component: FormularioComponent },
  { path: 'reservas/editar/:id', component: FormularioComponent },
  { path: '**', redirectTo: 'reservas' }
];
