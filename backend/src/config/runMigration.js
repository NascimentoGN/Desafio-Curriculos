require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

(async () => {
  let conn;
  try {
    // Conexão sem selecionar banco, para poder criá-lo
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    const sqlFile = path.join(__dirname, '..', '..', 'migrations', '001_create_candidatos.sql');
    const script = fs.readFileSync(sqlFile, 'utf8');

    // multipleStatements permite rodar o script inteiro de uma vez
    await conn.query(script);

    console.log('Migration executada com sucesso.');
    process.exit(0);
  } catch (err) {
    console.error('Erro na migration:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
})();