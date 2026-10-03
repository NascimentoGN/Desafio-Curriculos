import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Candidato,
  RespostaCriacao,
  RespostaExtracaoPdf
} from '../../shared/models/candidato.model';

@Injectable({ providedIn: 'root' })
export class CandidatoService {
  private readonly baseUrl = '/api/candidatos';

  constructor(private http: HttpClient) {}

  criar(candidato: Candidato): Observable<RespostaCriacao> {
    return this.http.post<RespostaCriacao>(this.baseUrl, candidato);
  }

  listar(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(this.baseUrl);
  }

  detalhar(id: number): Observable<Candidato> {
    return this.http.get<Candidato>(`${this.baseUrl}/${id}`);
  }

  extrairPdf(arquivo: File): Observable<RespostaExtracaoPdf> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return this.http.post<RespostaExtracaoPdf>(`${this.baseUrl}/extrair-pdf`, formData);
  }
}