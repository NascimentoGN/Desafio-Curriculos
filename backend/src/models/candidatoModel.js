const { pool } = require('../config/database');

async function criar(candidato) {
  const sql = `
    INSERT INTO candidatos
      (nome_completo, email, telefone, area_interesse, resumo_profissional)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(sql, [
    candidato.nomeCompleto,
    candidato.email,
    candidato.telefone || null,
    candidato.areaInteresse || null,
    candidato.resumoProfissional || null
  ]);
  return result.insertId;
}

async function listar() {
  const sql = `
    SELECT id, nome_completo, email, telefone, area_interesse, criado_em
    FROM candidatos
    ORDER BY criado_em DESC
  `;
  const [rows] = await pool.execute(sql);
  return rows;
}

async function buscarPorId(id) {
  const sql = 'SELECT * FROM candidatos WHERE id = ?';
  const [rows] = await pool.execute(sql, [id]);
  return rows[0] || null;
}

module.exports = { criar, listar, buscarPorId };