import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaArmario } from '../models/reserva-armario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReservaArmarioService {

    private apiUrl = 'http://localhost:8080/api/reservas';

    constructor(private http: HttpClient) { }

    // Listar todas as reservas
    listar(): Observable<ReservaArmario[]> {
        return this.http.get<ReservaArmario[]>(this.apiUrl).pipe(catchError(erro => this.tratarErro(erro)));
    }

    // Buscar reserva pelo ID
    buscarPorId(id: number): Observable<ReservaArmario> {
        return this.http.get<ReservaArmario>(`${this.apiUrl}/${id}`).pipe(catchError(erro => this.tratarErro(erro)));
    }

    // Cadastrar uma reserva
    cadastrar(obj: Omit<ReservaArmario, 'id'>): Observable<ReservaArmario> {
        return this.http.post<ReservaArmario>(this.apiUrl, obj).pipe(catchError(erro => this.tratarErro(erro)));
    }

    // Atualizar uma reserva
    atualizar(id: number, obj: ReservaArmario): Observable<ReservaArmario> {
        return this.http.put<ReservaArmario>(`${this.apiUrl}/${id}`, obj).pipe(catchError(erro => this.tratarErro(erro)));
    }

    // Excluir uma reserva
    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(erro => this.tratarErro(erro)));
    }

    // Executar regra de negócio
    executarRegra(id: number, params: Record<string, unknown>): Observable<ReservaArmario> {
        return this.http.patch<ReservaArmario>(`${this.apiUrl}/${id}/regra`, params).pipe(catchError(erro => this.tratarErro(erro)));
    }

    private tratarErro(erro: HttpErrorResponse) {
        let mensagem = 'Ocorreu um erro inesperado. Tente novamente.';

        if(erro.status === 400) {
            mensagem = erro.error?.message ||
            'Dados inválidos. Verifique as informações.';
        }

        else if(erro.status === 404) {
            mensagem = 'Reserva não encontrada.';
        }

        else if(erro.status === 409) {
            mensagem = erro.error?.message ||
            'Não foi possível realizar a operação. Existe um conflito.';
        }

        else if(erro.status === 0) {
            mensagem = 'Não foi possível conectar ao servidor';
        }

        else if(erro.status === 500) {
            mensagem = 'Erro interno no servidor. Tente novamente mais tarde.';
        }

        return throwError(() => Error(mensagem));
    }
}