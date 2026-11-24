import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ReservaArmarioService } from "../../services/reserva-armario.service";

@Component({
    selector: 'app-formulario-reserva',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './formulario-reserva.component.html',
    styleUrl: './formulario-reserva.component.css'
})
export class FormularioReservaComponent implements OnInit {
    formulario!: FormGroup;
    idReserva?: number;
    editando = false;

    constructor(
        private fb: FormBuilder,
        private reservaService: ReservaArmarioService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.formulario = this.fb.group({
            numeroArmario: ['', [Validators.required, Validators.min(1)]],
            nomeAluno: ['', [Validators.required, Validators.maxLength(100)]],
            dataInicio: ['', Validators.required],
            dataFim: ['', Validators.required],
            ativo: [true, Validators.required]
        });

        const id = this.route.snapshot.paramMap.get('id');

        if(id){
            this.idReserva = Number(id);
            this.editando = true;
            this.buscarReserva(this.idReserva);
        }
    }

    buscarReserva(id: number): void {
        this.reservaService.buscarPorId(id).subscribe({
            next:(reserva) => {
                this.formulario.patchValue(reserva);
            },
            error:(erro) => {
                console.error('Erro ao buscar reserva:', erro);
            }
        });
    }

    salvar(): void {
        if(this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        const dados = this.formulario.value;

        if(this.editando && this.idReserva) {
            this.reservaService.atualizar(this.idReserva, dados).subscribe({
                next: () => {
                    alert('Reserva atualizada com sucesso!');
                    this.router.navigate(['/reservas']);
                },
                error: (erro) => {
                    alert(erro.message);
                }
            });
        } else {
            this.reservaService.cadastrar(dados).subscribe({
                next: () => {
                    alert('Reserva cadastrada com sucesso!');
                    this.router.navigate(['/reservas']);
                },
                error: (erro) => {
                    alert(erro.message);
                }
            });
        }
    }

    cancelar(): void {
        this.router.navigate(['/reservas']);
    }
}