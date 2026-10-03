# Registro de Desenvolvimento

Documento que registra como o trabalho foi organizado e executado, quais decisões técnicas foram tomadas, como a IA foi utilizada, o que precisou ser corrigido, como a solução foi validada, o tempo dedicado e as limitações conhecidas.

---

## 1. Organização e execução do trabalho

O desenvolvimento foi conduzido em **seis blocos incrementais**, cada um deixando a aplicação em um estado funcional e testável antes de avançar para o próximo. Essa divisão reduziu o risco de acumular erros e permitiu isolar problemas com precisão.

### Blocos

| Bloco | Entrega |
|---|---|
| **1. Fundação** | Estrutura de pastas, `package.json`, servidor Express respondendo em `/health` |
| **2. Banco de dados** | Modelagem da entidade `Candidato`, migration, model de acesso |
| **3. API CRUD** | Rotas REST, controller, validações, tratamento de erros |
| **4. Upload de PDF** | Middleware de upload (Multer), leitura de PDF (`pdf-parse`), extração por regex |
| **5. Frontend Angular** | Service HTTP, rotas, componentes de cadastro, lista e detalhe |
| **6. Finalização** | Testes de cenário de erro, limpeza do repositório, documentação |

### Ordem adotada

O backend foi construído e validado **antes** do frontend. Isso permitiu testar toda a API via `curl` e Postman antes de existir qualquer interface — quando o frontend foi implementado, os contratos de entrada/saída já estavam sólidos.

Cada bloco terminava com uma **verificação prática** (um teste real que provava que aquele trecho funcionava) antes de avançar.

---

## 2. Principais decisões técnicas

### Backend

**Adoção do MySQL em vez de SQL Server.**
O enunciado pedia SQL Server. Optei por MySQL durante o desenvolvimento por ser mais leve de configurar em ambiente Windows doméstico e não impor requisitos de licenciamento. As decisões estruturais (migrations, queries parametrizadas, modelagem de tabela) são equivalentes e a migração para SQL Server seria direta, trocando apenas o driver (`mysql2` → `mssql`) e ajustando tipos (`VARCHAR` → `NVARCHAR`, `AUTO_INCREMENT` → `IDENTITY`, `TIMESTAMP` → `DATETIME2`).

**Driver `mysql2/promise` em vez de ORM.**
A aplicação tem apenas uma entidade. Um ORM (Sequelize, TypeORM) adicionaria complexidade desnecessária para o escopo. As queries com `pool.execute(sql, [params])` já previnem SQL Injection por parametrização.

**Extração de PDF via regex em vez de NLP.**
O próprio enunciado reconhece que a extração não precisa ser perfeita. `pdf-parse` + regex cobre os casos comuns (nome no topo, e-mail e telefone em qualquer lugar) com peso de dependência mínimo. Bibliotecas de NLP aumentariam o bundle sem ganho proporcional no escopo.

**`errorHandler` centralizado como middleware.**
Todas as exceções não tratadas nos controllers passam por um único ponto que devolve JSON padronizado. Isso evita repetir `try/catch` em cada handler e garante consistência das mensagens.

**Convenção `snake_case` no banco + `camelCase` na API.**
O banco segue a convenção idiomática do MySQL (`nome_completo`, `area_interesse`), enquanto a API expõe os campos em `camelCase` (`nomeCompleto`, `areaInteresse`) — mais natural em JavaScript/TypeScript. A tradução acontece na camada controller (`paraApi()`).

**Validação de upload em duas camadas.**
O `multer` rejeita arquivos não-PDF e maiores que 5 MB **antes** do controller. Isso significa que o arquivo nunca chega ao disco se for inválido. Validação redundante no frontend (mesmas regras em `onArquivoSelecionado`) dá feedback imediato ao usuário.

### Frontend

**Angular 17 com componentes standalone.**
Padrão atual do framework. Elimina `NgModules` e deixa cada componente autocontido. Menos boilerplate.

**Lazy loading via `loadComponent`.**
Cada rota carrega seu componente sob demanda. O bundle inicial cai para ~74 kB (transferência) e os chunks de cada feature (cadastro, lista, detalhe) são carregados só quando acessados.

**Proxy `/api` e `/health` em `proxy.conf.json`.**
Evita CORS durante o desenvolvimento e permite usar **URLs relativas** no `CandidatoService` (`/api/candidatos`), o que torna o código portável (basta trocar o proxy para apontar a outro backend).

**Service único (`CandidatoService`) com `HttpClient`.**
Toda comunicação HTTP está centralizada. Nenhum componente faz `fetch` direto. Se a API mudar, altera-se apenas o service.

**Formulário único para os dois fluxos.**
O cadastro manual e o cadastro com PDF usam **o mesmo formulário e as mesmas regras de validação**. A única diferença é que o fluxo com PDF chama `extrairPdf()` primeiro e pré-preenche os campos via `[(ngModel)]`. O usuário continua podendo editar tudo antes de salvar.

### Tema visual

**Paleta azul escuro + dourado + branco.**
Aplicada na topbar e no restante da aplicação. A escolha une um tom sóbrio (azul marinho `#0f2545`) com um detalhe quente de destaque (dourado `#c9a227`), transmitindo seriedade sem parecer corporativo demais.

**Fonte Inter.**
Carregada via Google Fonts, é a mesma família usada por diversos produtos de RH no mercado. Boa legibilidade em telas pequenas.

---

## 3. Ferramentas de IA utilizadas

- **Modelo:** assistente conversacional (ChatGPT) usado como apoio ao desenvolvimento.
- **Forma de uso:** consultas pontuais ao longo de cada bloco — nunca geração automática de código integral sem revisão.

A IA foi usada **como ferramenta de apoio à decisão e diagnóstico**, não como substituto do entendimento. Toda resposta foi lida, testada e adaptada ao contexto antes de ser aplicada.

---

## 4. Em quais etapas a IA ajudou

### Exemplo 1 — Escolha da stack inicial

**Pedido:** "Preciso separar objetivos e criar um caminho claro para um desafio de cadastro de currículos com frontend Angular e backend Node.js."

**Resposta aproveitada:** estruturação do plano em blocos incrementais com entregáveis parciais. Essa organização guiou todo o restante do trabalho.

### Exemplo 2 — Diagnóstico de conflito de porta

**Erro:** `EADDRINUSE: address already in use :::3000`

**Pedido:** "Erro `EADDRINUSE` ao subir o backend."

**Resposta aproveitada:** comando `Get-NetTCPConnection -LocalPort 3000 -State Listen` para descobrir o PID do processo antigo e `Stop-Process -Id <PID> -Force` para encerrá-lo. Utilizado todas as vezes em que o conflito reapareceu.

### Exemplo 3 — Erro de rotas no Angular

**Erro:** `NG04002: Cannot match any routes. URL Segment: 'cadastro'`

**Pedido:** "O menu não navega. Aparece `NG04002: Cannot match any routes` no console."

**Resposta aproveitada:** cadeia de verificação (`app.routes.ts` → `app.config.ts` → `main.ts`) que culminou na identificação de um caractere invisível (**BOM**, `\uFEFF`) no início de arquivos `.ts` criados pelo PowerShell — o que impedia o Angular de processar o `routerLink`. A solução foi recriar os arquivos pelo VS Code, que salva sem BOM por padrão.

### Exemplo 4 — Refinamento da regex de extração de PDF

**Pedido:** "A regex de nome está pegando `Hospital São Marcelino Champagnat` em vez do nome do candidato."

**Resposta aproveitada:** criação de lista de **palavras suspeitas** (`hospital`, `clínica`, `endereço`, `objetivo`, etc.) que invalidam o candidato a nome, e restrição do padrão para **2 a 4 palavras capitalize**. Optei por uma versão conservadora: quando em dúvida, o campo fica **vazio** para o usuário preencher, em vez de pré-preencher com dado errado.

### Exemplo 5 — Política de execução do PowerShell

**Erro:** `npm.ps1 não pode ser carregado porque a execução de scripts foi desabilitada`

**Pedido:** "O PowerShell bloqueia scripts npm."

**Resposta aproveitada:** `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` executado como administrador. Resolveu permanentemente.

---

## 5. O que precisou ser corrigido, adaptado ou descartado

### Corrigido

- **BOM em arquivos `.ts`** — arquivos criados via PowerShell ganhavam um `\uFEFF` invisível que quebrava imports e `routerLink`. Solução: sempre criar arquivos pelo VS Code.
- **Cache do `ng serve`** — após mudanças em `app.routes.ts` ou `app.config.ts`, o Angular às vezes servia versão antiga. Solução: apagar a pasta `.angular/` e reiniciar o `ng serve`.
- **URLs do proxy incompletas** — o `proxy.conf.json` inicial só cobria `/api`; precisei adicionar `/health` para o endpoint de health check funcionar via frontend.
- **Menu sem `href` no `<a>`** — sintoma de que `RouterLink` não estava sendo processado. Causa raiz: BOM no `app.component.ts` (ver acima).

### Adaptado

- **SQL Server → MySQL** — a decisão inicial era SQL Server (conforme o enunciado), mas troquei para MySQL durante o desenvolvimento por questões práticas de instalação em ambiente Windows doméstico. Ajustei o driver (`mssql` → `mysql2`), a migration e o model. As decisões de arquitetura permaneceram.
- **Nome da coluna `criado_em`** — adaptado ao padrão `snake_case` do MySQL, com conversão para `criadoEm` na resposta da API.
- **`errorHandler` mais informativo em desenvolvimento** — durante o debug de erros 500, considerei expor `err.message` na resposta. Optei por mantê-lo em `[ERROR] ...` no terminal (prática segura para produção).

### Descartado

- **Atualização do `multer` para 2.x** — o `npm audit` reporta vulnerabilidades no `multer` 1.x, mas a atualização quebraria a API atual. Documentei como melhoria futura e mantive a versão estável.
- **Substituição do `nodemon` por `node --watch`** — funcionaria e removeria as 3 vulnerabilidades de `braces` (devDependency). Adiada para não aumentar o escopo durante o desenvolvimento.
- **Regex "agressiva" de extração de nome** — testada e descartada porque capturava com mais frequência dados errados (nomes de empresas, instituições) do que a versão conservadora.

---

## 6. Como a solução foi verificada

### Backend — via `curl` e interface de linha de comando

| Teste | Resultado esperado | Obtido |
|---|---|---|
| `GET /health` | `{"status":"ok"}` | ✅ |
| `POST /api/candidatos` (válido) | `201` com `{ id, mensagem }` | ✅ |
| `POST /api/candidatos` (inválido) | `400` com lista de erros | ✅ |
| `GET /api/candidatos` | `200` com array | ✅ |
| `GET /api/candidatos/:id` | `200` com objeto | ✅ |
| `GET /api/candidatos/999` | `404` "Candidato não encontrado." | ✅ |
| `POST /api/candidatos/extrair-pdf` (PDF) | `200` com dados extraídos | ✅ |
| `POST /api/candidatos/extrair-pdf` (`.txt`) | `400` "Apenas arquivos PDF são aceitos." | ✅ |
| `POST /api/candidatos/extrair-pdf` (sem arquivo) | `400` "Nenhum arquivo enviado." | ✅ |

### Frontend — via navegador

- Validação de campos obrigatórios e formato de e-mail (Angular Forms).
- Cadastro manual via interface.
- Upload de PDF com pré-preenchimento de nome/e-mail/telefone.
- Navegação entre rotas (cadastro ↔ lista ↔ detalhe).
- Menu respondendo aos cliques (após correção de BOM).
- Build de produção (`ng build`) executado sem erros — bundle inicial de ~74 kB transferidos.

### Banco de dados

- Consulta via **MySQL Workbench** confirmando que cada cadastro feito pela interface persiste na tabela `candidatos`.

### Versionamento

- Repositório público no GitHub: <https://github.com/ShackalBeast/Desafio-Curriculos>
- `.gitignore` validado — `node_modules/`, `.env`, `dist/`, `.angular/` **não** versionados.

---

## 7. Tempo dedicado

Aproximadamente **8 a 10 horas**, distribuídas em:

| Etapa | Tempo |
|---|---|
| Configuração de ambiente (Node, MySQL, Angular CLI, Git) | ~2h |
| Backend (rotas, controller, model, migration) | ~2h |
| Upload e extração de PDF | ~1h |
| Frontend Angular (componentes, service, integração) | ~3h |
| Testes, ajustes e documentação | ~1-2h |

Boa parte do tempo foi consumida por **resolução de problemas de ambiente** (PATH do Node, execução de scripts no PowerShell, BOM em arquivos TypeScript, conflito de portas).

---

## 8. Dificuldades, limitações e melhorias

### Dificuldades encontradas

- **Configuração de ambiente no Windows:** política de execução do PowerShell bloqueava scripts npm; o PATH do Angular CLI não era reconhecido.
- **BOM invisível:** arquivos `.ts` criados pelo PowerShell ganhavam `\uFEFF` no início, quebrando imports e `RouterLink` sem emitir erro explícito. Difícil de diagnosticar.
- **Migração de máquina no meio do desenvolvimento:** exigiu reinstalação completa do ambiente (Node, MySQL, Angular CLI, Git) e reset da senha do MySQL. A senha com `@` exigiu ajuste no `.env`.
- **Extração de PDF:** regex não lida bem com layouts complexos (duas colunas, cabeçalhos com nome de empresa, PDFs escaneados). Aceita como limitação.

### Limitações conhecidas da solução

- **Extração de PDF baseada em regex** — funciona bem em currículos simples. Layouts complexos exigem preenchimento manual. Isso é consistente com o próprio enunciado do desafio.
- **Sem autenticação** — qualquer pessoa com acesso à URL pode listar candidatos. Fora do escopo.
- **Sem paginação** na listagem — aceitável para o volume esperado.
- **`multer` 1.x com vulnerabilidade conhecida** (`DoS` por negação de serviço) — risco **baixo** por ser dependência usada apenas em desenvolvimento e não receber input direto de usuário final.
- **Sem testes automatizados** (Jest, Jasmine) — toda verificação foi manual.

### Melhorias que faria com mais tempo

1. **Substituir `nodemon` por `node --watch`** — remove uma dependência, zera as vulnerabilidades reportadas pelo `npm audit` em devDependencies.
2. **Atualizar `multer` para 2.x** — API estável, com correções de segurança.
3. **Substituir regex de extração de PDF por NLP** — bibliotecas como `compromise` melhorariam a precisão de nomes próprios.
4. **Autenticação JWT** com perfis (admin / recrutador).
5. **Paginação e busca** na listagem de candidatos.
6. **Testes automatizados** — Jest no backend, Jasmine/Karma no frontend, com cobertura dos fluxos críticos.
7. **Docker Compose** para subir backend + frontend + MySQL com um único `docker compose up`.
8. **CI/CD** com GitHub Actions — build + lint + testes a cada push.
9. **Extração de mais campos** do PDF (área de interesse, resumo) — atualmente o PDF só preenche nome, e-mail e telefone.
10. **Preview do PDF carregado** na tela de cadastro, para o usuário conferir o que foi enviado.

---

## Conclusão

O desafio foi concluído com todos os requisitos funcionais atendidos: cadastro manual, cadastro com PDF (com fallback para preenchimento manual), listagem, tela de detalhes, validações, persistência em banco relacional e mensagens claras de erro.

A solução foi construída de forma incremental, com verificação prática em cada bloco, e está versionada publicamente em:

**<https://github.com/ShackalBeast/Desafio-Curriculos>**