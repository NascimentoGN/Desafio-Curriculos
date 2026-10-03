const candidatoModel = require('../models/candidatoModel');
const { validarCandidato } = require('../utils/validators');
const pdfService = require('../services/pdfService');

// Converte snake_case (banco) → camelCase (API)
function paraApi(row) {
  if (!row) return null;
  return {
    id: row.id,
    nomeCompleto: row.nome_completo,
    email: row.email,
    telefone: row.telefone,
    areaInteresse: row.area_interesse,
    resumoProfissional: row.resumo_profissional,
    criadoEm: row.criado_em
  };
}

async function criar(req, res, next) {
  try {
    const erros = validarCandidato(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
    }

    const id = await candidatoModel.criar(req.body);
    res.status(201).json({ id, mensagem: 'Cadastro salvo com sucesso.' });
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const rows = await candidatoModel.listar();
    res.json(rows.map(paraApi));
  } catch (err) {
    next(err);
  }
}

async function detalhar(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    const row = await candidatoModel.buscarPorId(id);
    if (!row) {
      return res.status(404).json({ mensagem: 'Candidato não encontrado.' });
    }

    res.json(paraApi(row));
  } catch (err) {
    next(err);
  }
}
async function extrairPdf(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ mensagem: 'Nenhum arquivo enviado.' });
    }

    const dados = await pdfService.extrairDados(req.file.path);

    // Apaga o arquivo temporário após a leitura
    const fs = require('fs');
    fs.unlink(req.file.path, () => {});

    res.json({
      mensagem: 'PDF processado. Revise os dados antes de salvar.',
      dados
    });
  } catch (err) {
    res.status(422).json({
      mensagem: 'Falha ao ler o PDF. Preencha os dados manualmente.',
      detalhe: err.message
    });
  }
}

module.exports = { criar, listar, detalhar, extrairPdf };