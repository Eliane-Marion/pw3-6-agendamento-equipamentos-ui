import { Routes } from '@angular/router';
import { ListagemComponent } from './components/listagem/listagem.component';
import { FormularioReservaComponent } from './components/formulario-reserva/formulario-reserva.component';

export const routes: Routes = [
    {
        path: 'reservas',
        component: ListagemComponent
    },
    {
        path: 'reservas/nova',
        component: FormularioReservaComponent
    },
    {
        path: 'reservas/editar/:id',
        component: FormularioReservaComponent
    },
    {
        path:'',
        redirectTo: 'reservas',
        pathMatch: 'full'
    }
];
