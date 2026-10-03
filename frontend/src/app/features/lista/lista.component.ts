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
    <div class="lista-container">
      <h2>Candidatos</h2>

      <table *ngIf="candidatos.length > 0; else semCandidatos">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Área</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of candidatos">
            <td>{{ c.nomeCompleto }}</td>
            <td>{{ c.email }}</td>
            <td>{{ c.telefone || '-' }}</td>
            <td>{{ c.areaInteresse || '-' }}</td>
            <td><a [routerLink]="['/candidatos', c.id]">Detalhes</a></td>
          </tr>
        </tbody>
      </table>

      <ng-template #semCandidatos>
        <p class="vazio">Nenhum candidato cadastrado ainda.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .lista-container { max-width: 900px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    h2 { margin: 0 0 1.5rem 0; color: #222; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #e0e0e0; padding: 0.75rem; text-align: left; }
    th { background: #f4f6fb; font-weight: 600; }
    tr:nth-child(even) { background: #fafafa; }
    a { color: #4a6cf7; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    .vazio { color: #777; text-align: center; padding: 2rem; }
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