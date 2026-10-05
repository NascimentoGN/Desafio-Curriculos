# Desafio Técnico — Cadastro de Currículos

Aplicação full stack para **cadastro e consulta de candidatos**, com suporte a **upload de currículo em PDF** para pré-preenchimento automático do formulário.

---

## Índice

- [Requisitos](#requisitos)
- [Stack](#stack)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Configuração do banco de dados](#configuração-do-banco-de-dados)
- [Como executar a aplicação](#como-executar-a-aplicação)
- [Endpoints da API](#endpoints-da-api)
- [Como rodar os testes](#como-rodar-os-testes)
- [Limitações conhecidas](#limitações-conhecidas)
- [Notas sobre SQL Server](#notas-sobre-sql-server)
- [Documentação adicional](#documentação-adicional)
- [Licença](#licença)

---

## Requisitos

### Funcionais

- **Cadastro manual** de candidatos via formulário.
- **Cadastro com PDF** — upload de currículo, extração de texto no backend e pré-preenchimento de nome, e-mail e telefone.
- **Mesmo formulário e mesmas validações** para os dois fluxos.
- **PDF opcional** — falha na leitura **não** bloqueia o cadastro manual.
- **Listagem** de candidatos com acesso à **tela de detalhes**.
- **Validações**: nome e e-mail obrigatórios, formato de e-mail, upload restrito a PDF de até 5 MB.
- **Mensagens claras** para: arquivo inválido, falha na leitura do PDF, cadastro salvo.

### Técnicos

- Interface simples e funcional, integrada ao backend.
- Leitura do PDF realizada **no backend**.
- Persistência em banco de dados relacional, com script de criação.
- API REST com respostas JSON padronizadas.

---

## Stack

### Backend

| Tecnologia | Versão |
|---|---|
| Node.js | 20+ |
| Express | 4.19.2 |
| mysql2 | 3.11.0 |
| Multer | 1.4.5-lts.1 |
| pdf-parse | 1.1.1 |
| dotenv | 16.4.5 |
| cors | 2.8.5 |

### Frontend

| Tecnologia | Versão |
|---|---|
| Angular | 17.3.x |
| TypeScript | 5.4.x |
| RxJS | 7.8.x |

### Banco de dados

| Tecnologia | Versão |
|---|---|
| MySQL | 8.x |

> **Observação sobre SQL Server:** o desafio original pedia SQL Server. Durante o desenvolvimento, optei por MySQL por conveniência de instalação em ambiente Windows doméstico. A estrutura é equivalente e a migração é direta — ver a seção [Notas sobre SQL Server](#notas-sobre-sql-server).

---

## Estrutura do projeto

```
desafio-curriculos/
├── backend/                    # API REST (Node.js + Express + MySQL)
│   ├── src/
│   │   ├── config/            # Conexão com banco + runner de migration
│   │   ├── controllers/       # Regras das requisições HTTP
│   │   ├── middlewares/       # Upload de PDF + tratamento de erros
│   │   ├── models/            # Acesso ao banco (queries parametrizadas)
│   │   ├── routes/            # Definição dos endpoints
│   │   ├── services/          # Extração de PDF
│   │   ├── utils/             # Validações
│   │   ├── app.js
│   │   └── server.js
│   ├── migrations/            # Scripts SQL versionados
│   ├── uploads/               # Arquivos temporários (não versionados)
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # SPA (Angular 17)
│   └── src/app/
│       ├── core/services/     # Comunicação HTTP com o backend
│       ├── features/          # Cadastro, Lista, Detalhe
│       └── shared/models/     # Interfaces TypeScript
│
├── database/                   # Documentação do banco (opcional)
├── README.md
└── DESENVOLVIMENTO.md          # Registro de desenvolvimento + uso de IA
```

---

## Configuração do banco de dados

### Instale o MySQL Server 8.x

- **Windows:** [MySQL Installer](https://dev.mysql.com/downloads/mysql/) (escolha "Server only" ou "Custom").
- **Durante a instalação:**
  - Autenticação: `Use Strong Password Encryption`
  - Defina a senha do usuário `root` e **anote-a**
  - Marque "Configure MySQL Server as a Windows Service" com início automático

Confirme que o serviço está rodando:

```powershell
Get-Service -Name "MySQL*"
```

Saída esperada:

```
Status   Name      DisplayName
------   ----      -----------
Running  MySQL80   MySQL Server 8.0
```

### Configure a conexão no `.env`

Dentro de `backend/`, copie o arquivo de exemplo:

```bash
cd backend
cp .env.example .env
```

Edite o `.env` com **suas credenciais**:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=curriculos_db

UPLOAD_MAX_SIZE_MB=5
```

> **Senha com caracteres especiais** (como `@`, `#`, `$`): coloque entre aspas duplas:
> ```env
> DB_PASSWORD="Senha#Com@Caracteres"
> ```

### Crie a estrutura do banco

O script de migration está em `backend/migrations/001_create_candidatos.sql`. Ele cria:

- O banco `curriculos_db`
- A tabela `candidatos` com as colunas: `id`, `nome_completo`, `email`, `telefone`, `area_interesse`, `resumo_profissional`, `criado_em`
- Um índice na coluna `email`

Para executar:

```bash
cd backend
npm run migrate
```

Saída esperada:

```
Migration executada com sucesso.
```

O script é **idempotente** — pode ser rodado múltiplas vezes sem erro (usa `IF NOT EXISTS`).

### Verifique no MySQL Workbench

Abra o Workbench, conecte com o usuário `root` e rode:

```sql
USE curriculos_db;
SHOW TABLES;
DESCRIBE candidatos;
```

Você deve ver a tabela `candidatos` com 7 colunas.

---

## Como executar a aplicação

### Pré-requisitos

- Node.js 20+ instalado (`node --version`)
- MySQL Server rodando
- Angular CLI 17 instalado globalmente:

```bash
npm install -g @angular/cli@17
```

### Backend

Abra um terminal:

```bash
cd backend
npm install
npm run migrate
npm run dev
```

Saída esperada:

```
Servidor rodando em http://localhost:3000
```

Para verificar:

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{"status":"ok","timestamp":"..."}
```

### Frontend

Abra **outro terminal** (deixe o backend rodando):

```bash
cd frontend
npm install
ng serve
```

Saída esperada:

```
** Angular Live Development Server is listening on localhost:4200 **
```

### Acesse

Abra no navegador:

```
http://localhost:4200
```

O menu superior tem duas opções:

- **Cadastrar** → formulário de cadastro (manual ou via PDF)
- **Candidatos** → lista de candidatos com acesso a detalhes

### Configuração do proxy (dev)

O arquivo `frontend/proxy.conf.json` redireciona as chamadas `/api/*` e `/health` para o backend em `http://localhost:3000`. Isso evita CORS no desenvolvimento e permite usar URLs relativas no `CandidatoService`.

---

## Endpoints da API

| Método | Rota | Descrição | Corpo / Parâmetros |
|---|---|---|---|
| `GET` | `/health` | Health check | — |
| `POST` | `/api/candidatos` | Cadastra candidato | JSON: `{ nomeCompleto, email, telefone?, areaInteresse?, resumoProfissional? }` |
| `GET` | `/api/candidatos` | Lista candidatos | — |
| `GET` | `/api/candidatos/:id` | Detalha um candidato | — |
| `POST` | `/api/candidatos/extrair-pdf` | Extrai dados do PDF | `multipart/form-data` com campo `arquivo` |

### Exemplos com `curl`

**Cadastrar candidato:**

```bash
curl -X POST http://localhost:3000/api/candidatos \
  -H "Content-Type: application/json" \
  -d '{"nomeCompleto":"Maria Silva","email":"maria@exemplo.com","telefone":"11987654321"}'
```

**Listar:**

```bash
curl http://localhost:3000/api/candidatos
```

**Extrair dados do PDF:**

```bash
curl -X POST http://localhost:3000/api/candidatos/extrair-pdf \
  -F "arquivo=@curriculo.pdf"
```

### Respostas de erro esperadas

| Situação | Status | Corpo |
|---|---|---|
| Campos obrigatórios faltando | `400` | `{"mensagem":"Dados inválidos.","erros":[...]}` |
| Arquivo não é PDF | `400` | `{"mensagem":"Apenas arquivos PDF são aceitos."}` |
| Arquivo > 5 MB | `400` | `{"mensagem":"Arquivo excede o tamanho máximo de 5 MB."}` |
| Candidato não encontrado | `404` | `{"mensagem":"Candidato não encontrado."}` |
| PDF ilegível | `422` | `{"mensagem":"Falha ao ler o PDF. Preencha os dados manualmente."}` |

---

## Como rodar os testes

Os testes automatizados **não foram implementados** no escopo do desafio. A verificação foi feita manualmente, cobrindo todos os fluxos. Documentado em [DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md#6-como-a-solução-foi-verificada).

### Roteiro de verificação manual

**1. Health check**

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{"status":"ok","timestamp":"..."}
```

**2. Cadastro manual via interface**

1. Acesse `http://localhost:4200/cadastro`
2. Preencha **Nome** e **E-mail**
3. Clique em **Salvar cadastro**
4. Esperado: mensagem `✅ Cadastro salvo com sucesso.` e redirecionamento para a lista

**3. Validação de campos**

1. Deixe o Nome vazio e clique fora
2. Digite `abc` no E-mail
3. Esperado: mensagens vermelhas abaixo dos campos; botão **Salvar** desabilitado

**4. Upload de PDF**

1. Em `/cadastro`, clique em **Enviar currículo**
2. Selecione um PDF de currículo
3. Esperado: campos Nome / E-mail / Telefone pré-preenchidos

**5. Rejeição de arquivo inválido**

1. Renomeie um arquivo de texto para `teste.txt`
2. Tente fazer upload
3. Esperado: mensagem `⚠️ Apenas arquivos PDF são aceitos.`

**6. Rejeição de PDF grande**

1. Tente enviar um PDF maior que 5 MB
2. Esperado: mensagem `⚠️ O arquivo excede o limite de 5 MB.`

**7. Cadastro válido via API**

```bash
curl -X POST http://localhost:3000/api/candidatos \
  -H "Content-Type: application/json" \
  -d '{"nomeCompleto":"João Teste","email":"joao@teste.com"}'
```

Esperado: `201` com `{"id":1,"mensagem":"Cadastro salvo com sucesso."}`

**8. Validação via API**

```bash
curl -X POST http://localhost:3000/api/candidatos \
  -H "Content-Type: application/json" \
  -d '{"email":"invalido"}'
```

Esperado: `400` com lista de erros

**9. Candidato inexistente**

```bash
curl http://localhost:3000/api/candidatos/99999
```

Esperado: `404` com `{"mensagem":"Candidato não encontrado."}`

**10. Persistência no banco**

No MySQL Workbench:

```sql
USE curriculos_db;
SELECT * FROM candidatos;
```

Esperado: os candidatos cadastrados aparecem na tabela.

---

## Limitações conhecidas

- **Extração de PDF por regex:** funciona bem em currículos com layout simples. Currículos com tabelas, múltiplas colunas ou PDFs escaneados (imagem) podem não ser interpretados corretamente.
- **Nome pode não ser identificado:** quando a extração não reconhece o nome com segurança, o campo é deixado **vazio** para preenchimento manual (em vez de pré-preencher com dado errado).
- **Sem autenticação:** a API é pública.
- **Sem paginação** na listagem.
- **Sem testes automatizados** — verificação manual.

Detalhamento completo em [DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md).

---

## Notas sobre SQL Server

O enunciado original pedia **SQL Server**. A aplicação foi construída com **MySQL** por conveniência de instalação. A migração para SQL Server é direta, alterando apenas:

### Dependência (`backend/package.json`)

```diff
- "mysql2": "^3.11.0"
+ "mssql": "^10.0.2"
```

### Variáveis do `.env`

```diff
- DB_HOST=localhost
- DB_PORT=3306
- DB_USER=root
- DB_PASSWORD=...
- DB_NAME=curriculos_db
+ DB_SERVER=localhost
+ DB_PORT=1433
+ DB_USER=sa
+ DB_PASSWORD=...
+ DB_NAME=CurriculosDB
+ DB_ENCRYPT=false
+ DB_TRUST_SERVER_CERTIFICATE=true
```

### Script de migration (`backend/migrations/001_create_candidatos.sql`)

Trocar `AUTO_INCREMENT` → `IDENTITY(1,1)`, `VARCHAR` → `NVARCHAR`, `TEXT` → `NVARCHAR(MAX)`, `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` → `DATETIME2 DEFAULT GETDATE()`, e substituir o separador `GO` (SQL Server não usa `multipleStatements`).

### Driver (`backend/src/config/database.js`)

Trocar o pool `mysql2/promise` por `mssql` e adaptar a assinatura das queries (placeholders `?` → `@nomeParam`).

### Model (`backend/src/models/candidatoModel.js`)

Substituir `pool.execute(sql, [...])` por `pool.request().input(...).query(sql)` e `result.insertId` por `result.recordset[0].Id`.

A arquitetura em camadas isola essas mudanças — nenhum outro arquivo é afetado.

---

## Documentação adicional

- [DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md) — Organização do trabalho, decisões técnicas, uso de IA, limitações e melhorias futuras.

---

## Licença

Este projeto está sob a licença MIT. Ver [LICENSE](./LICENSE) para mais detalhes.