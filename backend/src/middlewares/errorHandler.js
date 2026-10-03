module.exports = (err, req, res, next) => {
  console.error('[ERROR]', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ mensagem: 'Arquivo excede o tamanho máximo de 5 MB.' });
  }

  if (err.message && err.message.includes('PDF')) {
    return res.status(400).json({ mensagem: err.message });
  }

  res.status(500).json({ mensagem: 'Erro interno do servidor.' });
};