import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReservaArmario } from "../../models/reserva-armario.model";
import { ReservaArmarioService } from "../../services/reserva-armario.service";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-listagem',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './listagem.component.html',
    styleUrl: './listagem.component.css'
})
export class ListagemComponent implements OnInit {
    reservas: ReservaArmario[] = [];

    constructor(private reservaService: ReservaArmarioService) {}

    ngOnInit(): void {
        this.listarReservas();
    }

    listarReservas(): void {
        this.reservaService.listar().subscribe({
            next: (dados) => {
                this.reservas = dados;
            },
            error:(erro) => {
                alert(erro.message);
            }
        });
    }

    executarRegra(reserva: ReservaArmario): void {
        const novoStatus = !reserva.ativo;

        this.reservaService.executarRegra(
            reserva.id,
            {ativo: novoStatus}
        ).subscribe({
            next: () => {
                this.listarReservas();
            },
            error: (erro) => {
                alert(erro.message);
            }
        });
    }
}