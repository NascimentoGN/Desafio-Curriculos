const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarCandidato(dados) {
  const erros = [];

  if (!dados.nomeCompleto || dados.nomeCompleto.trim().length < 3) {
    erros.push('Nome completo é obrigatório (mínimo 3 caracteres).');
  }

  if (!dados.email || !REGEX_EMAIL.test(dados.email)) {
    erros.push('E-mail é obrigatório e deve ter formato válido.');
  }

  if (dados.email && dados.email.length > 255) {
    erros.push('E-mail excede 255 caracteres.');
  }

  if (dados.nomeCompleto && dados.nomeCompleto.length > 255) {
    erros.push('Nome completo excede 255 caracteres.');
  }

  return erros;
}

module.exports = { validarCandidato };