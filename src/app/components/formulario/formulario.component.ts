import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservaArmario } from '../../models/reserva-armario.model';
import { ReservaArmarioService } from '../../services/reserva-armario.service';

/** Validador do grupo: a data de fim precisa ser posterior à data de início. */
export const periodoValidoValidator: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const inicio = grupo.get('dataInicio')?.value;
  const fim = grupo.get('dataFim')?.value;
  if (inicio && fim && fim <= inicio) {   // datas 'AAAA-MM-DD' podem ser comparadas como texto
    return { periodoInvalido: true };
  }
  return null;
};

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ReservaArmarioService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    numeroArmario: [null as number | null, [Validators.required, Validators.min(1)]],
    nomeAluno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    dataInicio: ['', Validators.required],
    dataFim: ['', Validators.required]
  }, { validators: periodoValidoValidator });

  idEdicao: number | null = null;
  salvando = false;
  mensagemErro = '';

  get modoEdicao(): boolean {
    return this.idEdicao !== null;
  }

  ngOnInit(): void {
    // a mesma tela serve para inclusão (/reservas/novo) e edição (/reservas/editar/:id)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idEdicao = Number(id);
      this.service.buscarPorId(this.idEdicao).subscribe({
        next: (reserva) => this.form.patchValue(reserva),
        error: (erro: Error) => this.mensagemErro = erro.message
      });
    }
  }

  /** true quando o campo está inválido e o usuário já interagiu com ele */
  invalido(campo: string): boolean {
    const controle = this.form.get(campo);
    return !!controle && controle.invalid && (controle.touched || controle.dirty);
  }

  erro(campo: string, tipo: string): boolean {
    return !!this.form.get(campo)?.hasError(tipo);
  }

  get periodoInvalido(): boolean {
    return this.form.hasError('periodoInvalido') &&
      !!(this.form.get('dataFim')?.touched || this.form.get('dataFim')?.dirty);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();   // mostra as mensagens de todos os campos
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';

    const valores = this.form.value;
    const reserva: ReservaArmario = {
      numeroArmario: Number(valores.numeroArmario),
      nomeAluno: String(valores.nomeAluno).trim(),
      dataInicio: valores.dataInicio,
      dataFim: valores.dataFim
    };

    // POST para criar, PUT para editar
    const requisicao = this.modoEdicao
      ? this.service.atualizar(this.idEdicao!, reserva)
      : this.service.cadastrar(reserva);

    requisicao.subscribe({
      next: (salva) => {
        const texto = this.modoEdicao
          ? `Reserva do armário ${salva.numeroArmario} atualizada com sucesso.`
          : `Reserva do armário ${salva.numeroArmario} cadastrada com sucesso.`;
        this.router.navigate(['/reservas'], { state: { sucesso: texto } });
      },
      error: (erro: Error) => {
        // ex.: 409 "O armário já possui uma reserva ativa para o período informado."
        this.mensagemErro = erro.message;
        this.salvando = false;
      }
    });
  }
}
