import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CandidatoService } from '../../core/services/candidato.service';
import { Candidato } from '../../shared/models/candidato.model';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="lista-page">
      <header class="page-header">
        <div>
          <h2>Candidatos</h2>
          <p class="subtitulo">
            {{ candidatos.length === 0
              ? 'Nenhum candidato cadastrado ainda.'
              : candidatos.length + ' candidato(s) encontrado(s)' }}
          </p>
        </div>
        <a routerLink="/cadastro" class="btn-novo">+ Cadastrar candidato</a>
      </header>

      <div class="card" *ngIf="candidatos.length > 0; else semCandidatos">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Área</th>
              <th class="col-acao">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of candidatos">
              <td class="col-nome">{{ c.nomeCompleto }}</td>
              <td class="col-email">{{ c.email }}</td>
              <td>{{ c.telefone || '—' }}</td>
              <td>
                <span class="tag" *ngIf="c.areaInteresse; else semArea">{{ c.areaInteresse }}</span>
                <ng-template #semArea>—</ng-template>
              </td>
              <td class="col-acao">
                <a [routerLink]="['/candidatos', c.id]" class="link-detalhes">
                  Detalhes →
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #semCandidatos>
        <div class="empty-state">
          <div class="empty-icon">📄</div>
          <h3>Nenhum candidato por aqui</h3>
          <p>Comece cadastrando o primeiro candidato da sua base.</p>
          <a routerLink="/cadastro" class="btn-novo">+ Cadastrar agora</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    // Paleta
    $navy-900: #0f2545;
    $navy-800: #163560;
    $navy-700: #1e4580;
    $gold-500: #c9a227;
    $gold-100: #faf3da;
    $white: #ffffff;
    $bg-card: #ffffff;
    $text: #1a1a1a;
    $text-soft: #5a6472;
    $border: #e2e8f0;

    .lista-page { max-width: 1100px; margin: 0 auto; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1.75rem;
      gap: 1rem;
      flex-wrap: wrap;

      h2 {
        margin: 0 0 0.35rem 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: $navy-900;
        letter-spacing: -0.3px;
      }

      .subtitulo {
        margin: 0;
        color: $text-soft;
        font-size: 0.92rem;
      }
    }

    .btn-novo {
      display: inline-block;
      padding: 0.7rem 1.3rem;
      background: $navy-900;
      color: $white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        background: $navy-700;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(15, 37, 69, 0.25);
      }
    }

    .card {
      background: $bg-card;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(15, 37, 69, 0.08);
      overflow: hidden;
      border-top: 4px solid $gold-500;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.92rem;
    }

    thead {
      background: #f8fafc;

      th {
        text-align: left;
        padding: 1rem 1.25rem;
        font-size: 0.78rem;
        font-weight: 700;
        color: $text-soft;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1px solid $border;
      }
    }

    tbody tr {
      border-bottom: 1px solid $border;
      transition: background 0.15s;

      &:last-child { border-bottom: none; }
      &:hover { background: #fafbfd; }
    }

    td {
      padding: 1rem 1.25rem;
      color: $text;
      vertical-align: middle;
    }

    .col-nome {
      font-weight: 600;
      color: $navy-900;
    }

    .col-email {
      color: $text-soft;
    }

    .tag {
      display: inline-block;
      padding: 0.25rem 0.65rem;
      background: $gold-100;
      color: darken($gold-500, 15%);
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      border: 1px solid rgba(201, 162, 39, 0.3);
    }

    .col-acao {
      text-align: right;
      width: 130px;
    }

    .link-detalhes {
      color: $navy-700;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.88rem;
      transition: color 0.15s;

      &:hover {
        color: $gold-500;
      }
    }

    .empty-state {
      background: $white;
      border-radius: 12px;
      padding: 4rem 2rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(15, 37, 69, 0.08);
      border-top: 4px solid $gold-500;

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.4;
      }

      h3 {
        margin: 0 0 0.5rem 0;
        color: $navy-900;
        font-size: 1.2rem;
      }

      p {
        margin: 0 0 1.75rem 0;
        color: $text-soft;
      }
    }

    @media (max-width: 720px) {
      table { font-size: 0.85rem; }
      thead { display: none; }
      tbody tr {
        display: block;
        padding: 0.75rem 0;
      }
      td {
        display: block;
        padding: 0.25rem 1rem;
        text-align: left;
      }
      td::before {
        content: attr(data-label);
        font-weight: 700;
        color: $text-soft;
        display: inline-block;
        min-width: 80px;
      }
      .col-acao { text-align: left; width: auto; }
    }
  `]
})
export class ListaComponent implements OnInit {
  candidatos: Candidato[] = [];

  constructor(private service: CandidatoService) {}

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: (lista) => (this.candidatos = lista),
      error: () => (this.candidatos = [])
    });
  }
}