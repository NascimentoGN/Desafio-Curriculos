import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidatoService } from '../../core/services/candidato.service';
import { Candidato } from '../../shared/models/candidato.model';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  candidato: Candidato = {
    nomeCompleto: '',
    email: '',
    telefone: '',
    areaInteresse: '',
    resumoProfissional: ''
  };

  arquivoPdf: File | null = null;
  nomeArquivo = '';
  mensagemSucesso = '';
  mensagemErro = '';
  carregando = false;

  constructor(private service: CandidatoService, private router: Router) {}

  onArquivoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.nomeArquivo = file.name;
    if (file.type !== 'application/pdf') {
      this.mensagemErro = 'Apenas arquivos PDF são aceitos.';
      this.arquivoPdf = null;
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.mensagemErro = 'O arquivo excede o limite de 5 MB.';
      this.arquivoPdf = null;
      return;
    }
    this.arquivoPdf = file;
    this.extrairDados();
  }

  extrairDados(): void {
    if (!this.arquivoPdf) return;
    this.carregando = true;
    this.service.extrairPdf(this.arquivoPdf).subscribe({
      next: (resp) => {
        this.candidato.nomeCompleto = resp.dados.nomeCompleto || this.candidato.nomeCompleto;
        this.candidato.email = resp.dados.email || this.candidato.email;
        this.candidato.telefone = resp.dados.telefone || this.candidato.telefone;
        this.mensagemErro = '';
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Falha ao ler o PDF. Preencha os dados manualmente.';
        this.carregando = false;
      }
    });
  }

  salvar(form: any): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    if (form.invalid) {
      this.mensagemErro = 'Preencha os campos obrigatórios corretamente.';
      return;
    }
    this.carregando = true;
    this.service.criar(this.candidato).subscribe({
      next: (resp) => {
        this.mensagemSucesso = resp.mensagem;
        this.carregando = false;
        setTimeout(() => this.router.navigate(['/candidatos']), 1200);
      },
      error: (err) => {
        this.mensagemErro = err?.error?.mensagem || 'Erro ao salvar o cadastro.';
        this.carregando = false;
      }
    });
  }

  limpar(): void {
    this.candidato = {
      nomeCompleto: '', email: '', telefone: '', areaInteresse: '', resumoProfissional: ''
    };
    this.arquivoPdf = null;
    this.nomeArquivo = '';
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }
}