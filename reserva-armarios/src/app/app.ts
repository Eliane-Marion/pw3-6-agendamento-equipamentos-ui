import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListagemComponent } from './components/listagem/listagem.component';

@Component({
  imports: [RouterOutlet, ListagemComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('reserva-armarios');
}
