# Changelog

Todas as mudanças notáveis deste projeto estão documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [1.1.0] — 2026-05 (conta e personalização)

Versão com **login opcional**, perfil do aluno e tela inicial unificada. A grade continua utilizável sem conta.

### Adicionado

- Login **Google** e **e-mail/senha** (Supabase Auth)
- **Onboarding** na tela inicial (curso, nome, período — primeira vez ou `?edit=1`)
- [perfil.html](perfil.html): dados, resumo de desempenho, **Salvar/Carregar na nuvem**
- Tela inicial com duas faces: visitante (login) e logado (Início + atalhos)
- Perfil no menu lateral; logado vê **apenas o curso do perfil** no menu
- Backup na nuvem (`user_sync_snapshots`) inclui perfil e progresso (`exportAll` v2)
- `syncAfterLogin`: restaura perfil/prefs da nuvem em novo aparelho
- FAQ com **busca** e índice lateral; drawer mobile com rótulos legíveis
- Redirect OAuth pela URL atual do site (Vercel)

### Alterado

- `entrar.html` e `conta.html` passam a **redirecionar** (`index.html` / `perfil.html`)
- Tema **claro** como padrão
- Documentação: [docs/planejamento.md](docs/planejamento.md), [docs/backend.md](docs/backend.md), checklist

### Decisões de produto (não são bugs)

- Sem hub de cards dos 7 cursos na index nem “ver outros cursos” no menu logado — ênfase no curso da conta; outras grades via visitante ou sair da conta
- Sync na nuvem **manual** em Perfil; sync automático ao marcar disciplina fica para versão futura

### Fora do escopo desta release

- Sync automático com debounce
- Temas extras; redesign do tema escuro (feedback pendente)
- CI / testes E2E

---

## [1.0.0-static] — 2026-05-23

Versão **congelada** da grade estática (sem backend, sem login). Tag de referência antes das mudanças maiores de persistência na nuvem.

### Escopo desta release

- **7 cursos** do campus Alegrete (ES, CC, EC, EE, EM, EA, ET)
- Grade interativa com pré-requisitos, ementas, CCCGs e integralização de CH
- Página **Horários** com agenda semanal, disciplinas avulsas e anotações
- Exportação **CSV** e **PDF/impressão** da grade personalizada
- Exportação **PDF** e **PNG** da agenda de horários
- **Backup JSON** (exportar/importar) em Acessibilidade
- Temas, tamanho de fonte, FAQ, PWA com **fontes e ícones locais** (offline)
- Motor da grade modularizado em **`js/grade/`** (`main.js` como orquestrador)
- **Testes unitários** das regras puras (`npm test` — pré-requisitos, CH, CCCG)

### Fora do escopo (próximas versões)

- Login, sincronização na nuvem, banco próprio
- Sugestão de disciplinas / agente conversacional
- PNG da grade no estilo fluxograma oficial da UNIPAMPA
- PDF por semestre
- CI automatizado (GitHub Actions) e testes de interface

### Adicionado

- Link **Editar horário, sala e professor** no modal de detalhes da disciplina
- Aviso de **backup** na primeira visita ou após marcar progresso (dismissível)
- Self-host de **Source Sans 3** e **Tabler Icons** (`assets/fonts/`, `assets/vendor/`)
- Pré-requisitos e CCCGs no CSV com **quebra de linha dentro da célula** (Sheets mobile)
- Parâmetro `?curso=` na URL de Horários ao abrir a partir da grade
- Módulos em **`js/grade/`**: regras (`normalize`, `ch`, `prereqs`, `cccg-rules`) e UI (`dom`, `modal`, `render`, `toolbar`, `cccg-picker`, etc.)
- Suite **`tests/grade-core.test.mjs`** (10 testes via `node:test`)

### Alterado

- **`main.js`** reduzido a bootstrap, regras e wiring (~500 linhas); lógica extraída para factories em `js/grade/`
- **`sidebar.js`** compartilhado; páginas estáticas (`index`, `faq`, `sobre`, `acessibilidade`, `horarios`) não carregam mais `main.js`
- Service Worker **`grade-unipampa-v24`** — cache dos novos módulos da grade

### Documentação

- README e FAQ atualizados com exportações, horários e limitações offline
- Este CHANGELOG

[1.0.0-static]: https://github.com/samuel-fossari/grade-curricular-unipampa/releases/tag/v1.0.0-static
