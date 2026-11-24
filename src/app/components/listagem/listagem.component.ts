import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReservaArmario } from '../../models/reserva-armario.model';
import { ReservaArmarioService } from '../../services/reserva-armario.service';

@Component({
  selector: 'app-listagem',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.css'
})
export class ListagemComponent implements OnInit {

  private readonly service = inject(ReservaArmarioService);
  private readonly router = inject(Router);

  reservas: ReservaArmario[] = [];
  carregando = false;
  mensagemSucesso = '';
  mensagemErro = '';

  constructor() {
    // mensagem enviada pelo formulário depois de salvar
    const estado = this.router.getCurrentNavigation()?.extras.state;
    if (estado && estado['sucesso']) {
      this.mensagemSucesso = estado['sucesso'];
    }
  }

  ngOnInit(): void {
    this.carregar();
  }

  /** GET: carrega as reservas do backend */
  carregar(): void {
    this.carregando = true;
    this.service.listar().subscribe({
      next: (dados) => {
        this.reservas = dados;
        this.carregando = false;
      },
      error: (erro: Error) => {
        this.mensagemErro = erro.message;
        this.carregando = false;
      }
    });
  }

  /** Regra de negócio: PATCH /liberar */
  liberar(reserva: ReservaArmario): void {
    if (!reserva.id) return;
    this.limparMensagens();
    this.service.executarRegra(reserva.id).subscribe({
      next: () => {
        this.mensagemSucesso = `Armário ${reserva.numeroArmario} liberado com sucesso.`;
        this.carregar();
      },
      error: (erro: Error) => this.mensagemErro = erro.message
    });
  }

  editar(reserva: ReservaArmario): void {
    this.router.navigate(['/reservas/editar', reserva.id]);
  }

  /** DELETE: exclui a reserva após confirmação */
  excluir(reserva: ReservaArmario): void {
    if (!reserva.id) return;
    const confirmou = confirm(
      `Deseja excluir a reserva do armário ${reserva.numeroArmario} (${reserva.nomeAluno})?`);
    if (!confirmou) return;

    this.limparMensagens();
    this.service.excluir(reserva.id).subscribe({
      next: () => {
        this.mensagemSucesso = 'Reserva excluída com sucesso.';
        this.carregar();
      },
      error: (erro: Error) => this.mensagemErro = erro.message
    });
  }

  get totalAtivas(): number {
    return this.reservas.filter(r => r.ativo).length;
  }

  limparMensagens(): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }
}
