CREATE DATABASE IF NOT EXISTS curriculos_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE curriculos_db;

CREATE TABLE IF NOT EXISTS candidatos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(50) NULL,
  area_interesse VARCHAR(255) NULL,
  resumo_profissional TEXT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;