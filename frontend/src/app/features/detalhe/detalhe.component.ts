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
    <div class="detalhe-page">
      <a routerLink="/candidatos" class="voltar">← Voltar para a lista</a>

      <div *ngIf="candidato; else carregando" class="detalhe-card">
        <header class="card-header">
          <div class="avatar">{{ iniciais }}</div>
          <div class="header-info">
            <h2>{{ candidato.nomeCompleto }}</h2>
            <p class="area" *ngIf="candidato.areaInteresse">
              {{ candidato.areaInteresse }}
            </p>
          </div>
        </header>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">E-mail</span>
            <span class="info-valor">
              <a [href]="'mailto:' + candidato.email">{{ candidato.email }}</a>
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">Telefone</span>
            <span class="info-valor">{{ candidato.telefone || 'Não informado' }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Área de interesse</span>
            <span class="info-valor">{{ candidato.areaInteresse || 'Não informado' }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Cadastrado em</span>
            <span class="info-valor">{{ candidato.criadoEm | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>

        <div class="resumo-section">
          <h3>Resumo profissional</h3>
          <p class="resumo-texto">
            {{ candidato.resumoProfissional || 'Nenhum resumo informado.' }}
          </p>
        </div>
      </div>

      <ng-template #carregando>
        <div class="loading">
          <p>Carregando candidato...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    $navy-900: #0f2545;
    $navy-800: #163560;
    $navy-700: #1e4580;
    $gold-500: #c9a227;
    $gold-100: #faf3da;
    $white: #ffffff;
    $text: #1a1a1a;
    $text-soft: #5a6472;
    $border: #e2e8f0;

    .detalhe-page {
      max-width: 800px;
      margin: 0 auto;
    }

    .voltar {
      display: inline-block;
      margin-bottom: 1.25rem;
      color: $navy-700;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: color 0.15s;

      &:hover {
        color: $gold-500;
      }
    }

    .detalhe-card {
      background: $white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(15, 37, 69, 0.08);
      overflow: hidden;
      border-top: 4px solid $gold-500;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 2rem 2rem 1.5rem;
      background: linear-gradient(180deg, #f8fafc 0%, $white 100%);
      border-bottom: 1px solid $border;

      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: $navy-900;
        color: $gold-100;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.4rem;
        letter-spacing: 1px;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(15, 37, 69, 0.2);
      }

      .header-info {
        h2 {
          margin: 0 0 0.25rem 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: $navy-900;
          letter-spacing: -0.3px;
        }

        .area {
          margin: 0;
          color: $gold-500;
          font-weight: 600;
          font-size: 0.92rem;
        }
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid $border;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      padding: 0.6rem 0;
    }

    .info-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: $text-soft;
    }

    .info-valor {
      font-size: 0.98rem;
      color: $text;
      font-weight: 500;

      a {
        color: $navy-700;
        text-decoration: none;

        &:hover {
          color: $gold-500;
          text-decoration: underline;
        }
      }
    }

    .resumo-section {
      padding: 1.5rem 2rem 2rem;

      h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        font-weight: 700;
        color: $navy-900;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .resumo-texto {
        margin: 0;
        color: $text;
        line-height: 1.7;
        font-size: 0.95rem;
        background: #f8fafc;
        padding: 1.25rem;
        border-radius: 6px;
        border-left: 3px solid $gold-500;
        white-space: pre-wrap;
      }
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: $text-soft;
    }

    @media (max-width: 640px) {
      .card-header {
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
        padding: 1rem 1.5rem;
      }

      .resumo-section {
        padding: 1rem 1.5rem 1.5rem;
      }
    }
  `]
})
export class DetalheComponent implements OnInit {
  candidato?: Candidato;

  constructor(private route: ActivatedRoute, private service: CandidatoService) {}

  get iniciais(): string {
    if (!this.candidato?.nomeCompleto) return '?';
    return this.candidato.nomeCompleto
      .split(' ')
      .filter((p) => p.length > 2)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.service.detalhar(id).subscribe({
      next: (c) => (this.candidato = c),
      error: () => (this.candidato = undefined)
    });
  }
}