import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CandidatoService } from '../../core/services/candidato.service';
import { Candidato } from '../../shared/models/candidato.model';

@Component({
  selector: 'app-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detalhe-container">
      <a routerLink="/candidatos" class="voltar">← Voltar</a>

      <div *ngIf="candidato; else carregando" class="cartao">
        <h2>{{ candidato.nomeCompleto }}</h2>
        <p><strong>E-mail:</strong> {{ candidato.email }}</p>
        <p><strong>Telefone:</strong> {{ candidato.telefone || 'Não informado' }}</p>
        <p><strong>Área de interesse:</strong> {{ candidato.areaInteresse || 'Não informado' }}</p>
        <p><strong>Resumo profissional:</strong></p>
        <p class="resumo">{{ candidato.resumoProfissional || 'Não informado.' }}</p>
        <p class="data"><small>Cadastrado em {{ candidato.criadoEm | date:'dd/MM/yyyy HH:mm' }}</small></p>
      </div>

      <ng-template #carregando>
        <p>Carregando...</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .detalhe-container { max-width: 700px; margin: 2rem auto; padding: 2rem; }
    .voltar { display: inline-block; margin-bottom: 1rem; color: #4a6cf7; text-decoration: none; font-weight: 600; }
    .voltar:hover { text-decoration: underline; }
    .cartao { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    h2 { margin: 0 0 1rem 0; color: #222; }
    p { margin: 0.5rem 0; color: #333; }
    .resumo { background: #f5f7fa; padding: 1rem; border-radius: 4px; line-height: 1.5; }
    .data { margin-top: 1.5rem; color: #777; }
  `]
})
export class DetalheComponent implements OnInit {
  candidato?: Candidato;

  constructor(private route: ActivatedRoute, private service: CandidatoService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.service.detalhar(id).subscribe({
      next: (c) => (this.candidato = c),
      error: () => (this.candidato = undefined)
    });
  }
}