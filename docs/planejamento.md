# Estado do projeto e planejamento — Grade Curricular UNIPAMPA

**Atualizado:** maio/2026  
**Produção:** [grade-curricular-unipampa.vercel.app](https://grade-curricular-unipampa.vercel.app)  
**Objetivo deste documento:** registrar o **estado real** do código, as **decisões de produto** e o que está **planejado para o futuro** (não é uma lista de pendências antigas).

---

## 1. Resumo executivo

Site estático (HTML + JS + CSS) com **PWA**, **7 grades** do campus Alegrete, motor modular em `js/grade/` e, opcionalmente, **Supabase** (login + backup na nuvem).

| Camada | Estado |
|--------|--------|
| Grades, horários, exportações, backup JSON, offline | ✅ Estável (base v1.0.0-static) |
| Conta: login, perfil, onboarding, sync manual | ✅ Em produção |
| Tela inicial unificada (visitante / logado) | ✅ |
| Sync automático ao marcar disciplina | ⏳ Planejado |
| Redesign do tema escuro + temas extras | ⏳ Pesquisa / futuro |
| CI, testes E2E | ❌ Não implementado |

**Testes automatizados:** `npm test` — 12 testes (regras da grade + persistência).

---

## 2. Decisões de produto (vigentes)

Estas escolhas são **intencionais**, não lacunas esquecidas.

### 2.1 Um curso por conta (sem “ver outros cursos” no menu)

Com login, o menu lateral destaca **apenas o curso do perfil** (ex.: Engenharia de Software). Não há botão “ver outros cursos” nem lista dos sete cursos para quem está logado.

**Motivo:** dar ênfase ao curso do aluno. Quem quiser explorar outras grades pode usar **Continuar sem conta** (visitante vê os 7 cursos no menu) ou **sair da conta**.

### 2.2 Tela inicial sem hub de cards de cursos

A [tela inicial](../index.html) não lista mais todos os cursos em cards. Ela concentra o **aviso do projeto** e o **fluxo de entrada** (login ou continuar sem conta). Logado, mostra atalhos (Perfil, Minha grade, Sair).

**Motivo:** mesmo princípio da ênfase no curso da conta; layout mais limpo que a index antiga com grade de cursos.

### 2.3 Sync na nuvem (hoje manual; automático no futuro)

Hoje o progresso sincroniza quando o usuário usa **Salvar na nuvem** / **Carregar da nuvem** em [perfil.html](../perfil.html), e há restauração inteligente após login (`syncAfterLogin` em `js/sync/cloud-sync.js`).

**Sync automático** (ex.: alguns segundos após marcar uma disciplina, só se logado) é **desejável e planejado**, com cuidado para não sobrescrever dados locais com nuvem vazia.

### 2.4 Temas

- **Claro** — padrão ao abrir o site.
- **Escuro** e **alto contraste** — disponíveis, mas o tema escuro recebeu **reclamações visuais**; antes de novos temas (“extras”), o foco é **pesquisar e redesenhar** o escuro (paleta, contraste, componentes).
- **Temas extras** só para logados — **não** no escopo atual; depende do redesign do escuro.

### 2.5 Perfil na sidebar (não há “indicador de conta” separado)

O item **Perfil** no menu lateral **é** o hub da conta: dados, desempenho na grade, nuvem e sair. Não está previsto um segundo ícone ou badge só para “estado da conta” — seria redundante com **Perfil**.

### 2.6 “Continuar sem conta”

Sempre oferecido na tela inicial. Visitante navega com **todos os cursos** no menu; progresso só no navegador, salvo backup em Acessibilidade.

---

## 3. Glossário (termos do projeto)

### Onboarding

**Primeira configuração do perfil** depois de criar conta ou entrar (Google/e-mail), na própria [index.html](../index.html):

- Nome (opcional)
- **Curso** (obrigatório)
- Período atual, ano de ingresso, matrícula (opcionais)

Aparece só enquanto `onboardingDone` não estiver salvo ou quando o usuário abre **Editar perfil** (`index.html?edit=1`). Depois de salvar, a tela inicial logada mostra **Início** (atalhos), não o formulário de novo.

Não é um tutorial do site — é o cadastro mínimo para personalizar menu e “Minha grade”.

### Perfil

Página [perfil.html](../perfil.html): exibe os dados do onboarding, resumo de progresso na grade e botões de **nuvem** (salvar/carregar backup remoto).

### Visitante vs logado

| | Visitante | Logado |
|---|-----------|--------|
| Menu cursos | 7 cursos | Só o curso do perfil |
| Perfil no menu | Não | Sim |
| Nuvem | Não | Opcional (manual) |
| Tela inicial | Login / sem conta | Início + atalhos |

### URLs legadas

- `entrar.html` e `conta.html` → redirecionam para `index.html` e `perfil.html`.

---

## 4. Arquitetura atual

### 4.1 Páginas principais

```
index.html     → entrada (visitante: login; logado: início)
perfil.html    → conta, desempenho, nuvem
cursos/*.html  → grade interativa (não exige login)
horarios.html, faq.html, acessibilidade.html, sobre.html
```

### 4.2 Dados

- **localStorage** — progresso, perfil, prefs, horários (por navegador).
- **Supabase** — tabela `user_sync_snapshots`: um JSON por usuário = `GRADE_STORAGE.exportAll()` (versão 2, inclui `profile`).
- Após login, `syncAfterLogin` pode **restaurar perfil e prefs** da nuvem (útil em outro aparelho).

### 4.3 Auth

Scripts Supabase em `index.html` e `perfil.html` (e guards). Redirect OAuth usa a **origem atual** do navegador (`js/auth/session.js`).

Configuração: [backend.md](backend.md).

### 4.4 Service Worker

Cache estático em `sw.js` (versão incrementada a cada release). `supabase-config.js` sempre pela rede. SW desligado em localhost.

---

## 5. O que está implementado (checklist de alto nível)

- [x] Sete PPCs em `js/cursos/*.js`
- [x] Motor da grade (`js/grade/*`, `main.js`)
- [x] Horários, FAQ (com busca), Acessibilidade, Sobre
- [x] Login Google + e-mail/senha (Supabase)
- [x] Onboarding + perfil + edição (`?edit=1`)
- [x] Sidebar: Tela inicial, Perfil (se logado), um curso (se logado)
- [x] Sync manual + lógica pós-login
- [x] Deploy Vercel + doc Supabase
- [x] Testes unitários das regras (`npm test`)

---

## 6. Roadmap futuro (prioridade sugerida)

| Prioridade | Item | Notas |
|------------|------|--------|
| Alta | Alinhar / validar documentação e checklist manual | Em andamento |
| Alta | **Sync automático** com debounce (logado) | Respeitar regras atuais de conflito local/remoto |
| Média | **Redesign tema escuro** | Pesquisa com usuários; não adicionar temas extras antes |
| Baixa | Temas extras (paletas) | Após escuro estável |
| Baixa | CI (`npm test` no push) | |
| Baixa | Testes E2E | Playwright está no package.json, sem uso |
| — | Itens do CHANGELOG v1.0 “fora do escopo” | Agente/IA, PNG fluxograma oficial, PDF por semestre, etc. |

---

## 7. Referências no código

| Tópico | Arquivo |
|--------|---------|
| Perfil / onboarding | `js/profile.js`, `js/auth/onboarding.js` |
| Tela inicial | `js/index-page.js`, `index.html` |
| Sync | `js/sync/cloud-sync.js`, `js/grade-storage.js` |
| Auth | `js/auth/session.js`, `js/auth/account-panel.js` |
| Menu | `js/sidebar.js`, `js/mobile-nav.js` |
| Grade | `js/main.js`, `js/grade/*` |
| Deploy / Supabase | `docs/backend.md`, `vercel.json` |
| Validação manual | [checklist-validacao.md](checklist-validacao.md) |

---

*Documento vivo: atualizar quando mudar decisões de produto ou releases.*
