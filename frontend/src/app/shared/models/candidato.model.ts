export interface Candidato {
  id?: number;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  areaInteresse?: string;
  resumoProfissional?: string;
  criadoEm?: string;
}

export interface RespostaExtracaoPdf {
  mensagem: string;
  dados: Partial<Candidato>;
}

export interface RespostaCriacao {
  id: number;
  mensagem: string;
}