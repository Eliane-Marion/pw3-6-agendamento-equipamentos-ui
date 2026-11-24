import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ReservaArmario } from '../models/reserva-armario.model';

/**
 * Serviço que consome todos os endpoints do backend Spring Boot.
 */
@Injectable({
  providedIn: 'root'
})
export class ReservaArmarioService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/armarios';

  /** GET /api/armarios */
  listar(): Observable<ReservaArmario[]> {
    return this.http.get<ReservaArmario[]>(this.apiUrl)
      .pipe(catchError(this.tratarErro));
  }

  /** GET /api/armarios/{id} */
  buscarPorId(id: number): Observable<ReservaArmario> {
    return this.http.get<ReservaArmario>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.tratarErro));
  }

  /** POST /api/armarios */
  cadastrar(reserva: ReservaArmario): Observable<ReservaArmario> {
    return this.http.post<ReservaArmario>(this.apiUrl, reserva)
      .pipe(catchError(this.tratarErro));
  }

  /** PUT /api/armarios/{id} */
  atualizar(id: number, reserva: ReservaArmario): Observable<ReservaArmario> {
    return this.http.put<ReservaArmario>(`${this.apiUrl}/${id}`, reserva)
      .pipe(catchError(this.tratarErro));
  }

  /** DELETE /api/armarios/{id} */
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.tratarErro));
  }

  /** Regra de negócio: PATCH /api/armarios/{id}/liberar */
  executarRegra(id: number): Observable<ReservaArmario> {
    return this.http.patch<ReservaArmario>(`${this.apiUrl}/${id}/liberar`, {})
      .pipe(catchError(this.tratarErro));
  }

  /** Atalho com nome mais claro para a regra de negócio. */
  liberar(id: number): Observable<ReservaArmario> {
    return this.executarRegra(id);
  }

  /**
   * Converte o erro HTTP em uma mensagem amigável.
   * Quando a regra de negócio do Java bloqueia algo (400 ou 409),
   * o backend envia { mensagem: '...' }, que é repassada para a tela.
   */
  private tratarErro(erro: HttpErrorResponse): Observable<never> {
    let mensagem: string;

    if (erro.status === 0) {
      mensagem = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 8080.';
    } else if (erro.error && typeof erro.error === 'object' && erro.error['mensagem']) {
      mensagem = erro.error['mensagem'];
    } else if (erro.status === 404) {
      mensagem = 'Reserva não encontrada.';
    } else if (erro.status === 409) {
      mensagem = 'Operação bloqueada pela regra de negócio.';
    } else if (erro.status === 400) {
      mensagem = 'Dados inválidos. Confira os campos e tente novamente.';
    } else {
      mensagem = 'Erro inesperado. Tente novamente mais tarde.';
    }

    return throwError(() => new Error(`Erro: ${mensagem}`));
  }
}
