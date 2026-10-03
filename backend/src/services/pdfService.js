const fs = require('fs');
const pdfParse = require('pdf-parse');

const REGEX_EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const REGEX_TELEFONE = /(\+?\d{1,3}[\s-]?)?(\(?\d{2,3}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}/;

// Nome: só aceita 2 a 4 palavras com capitalize
const REGEX_NOME = /^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][a-záéíóúâêîôûãõç]+(?: [A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][a-záéíóúâêîôûãõç]+){1,3}$/m;

// Palavras que indicam que NÃO é um nome de pessoa
const PALAVRAS_SUSPEITAS = [
  'hospital', 'clínica', 'clinica', 'escola', 'colégio', 'colegio',
  'universidade', 'faculdade', 'instituto', 'empresa', 'ltda', 'me',
  'eireli', 's.a', 'sa', 'currículo', 'curriculo', 'curriculum',
  'vitae', 'endereço', 'endereco', 'bairro', 'rua', 'avenida',
  'cidade', 'estado', 'cep', 'fone', 'telefone', 'celular',
  'objetivo', 'formação', 'formacao', 'experiência', 'experiencia'
];

function linhaPareceNome(linha) {
  const lower = linha.toLowerCase();
  return !PALAVRAS_SUSPEITAS.some((p) => lower.includes(p));
}

function extrairNome(text) {
  // Estratégia 1: procurar após "Nome:" ou "Nome completo:"
  const matchNomeLabel = text.match(/Nome(?:\s+completo)?\s*[:\-]\s*([^\n]+)/i);
  if (matchNomeLabel) {
    const candidato = matchNomeLabel[1].trim();
    if (candidato.length >= 3 && candidato.length <= 80) {
      return candidato;
    }
  }

  // Estratégia 2: varrer linha por linha, pegar a primeira que parece nome
  const linhas = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  for (const linha of linhas.slice(0, 15)) {  // olha só as primeiras 15 linhas
    const match = linha.match(REGEX_NOME);
    if (match && linhaPareceNome(match[0])) {
      return match[0].trim();
    }
  }

  return null;
}

async function extrairDados(caminhoPdf) {
  const buffer = fs.readFileSync(caminhoPdf);
  const { text } = await pdfParse(buffer);

  const email = text.match(REGEX_EMAIL)?.[0] || null;

  const telefoneMatch = text.match(REGEX_TELEFONE);
  const telefone = telefoneMatch ? telefoneMatch[0].trim() : null;

  const nomeCompleto = extrairNome(text);

  return { nomeCompleto, email, telefone };
}

module.exports = { extrairDados };